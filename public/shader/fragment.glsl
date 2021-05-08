uniform float time;
uniform float progress;
uniform sampler2D tex0, tex1, cubemapTex;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying vec4 coords;
uniform samplerCube skybox;	

vec3 uLigthPos = vec3(-0.14, 0.1, 0.4);
float uDisplace = 1.2;
vec3 uCam = vec3(0.,15.04,0.001), 
ucamUpVector= vec3(0.,0.,1.), 
uCamView= vec3(0.,0.,0.);

float uLightIntensity = 0.15, 
uRayMaxDistance= 80., 
uRefelctionIntensity = 0.75, 
uRefractionAngle= 0.2, 
uRefractionIntensity = 0.65;

bool depthFlag;
//#define USE_OREN_NAYAR_LIGHT_MODEL
#define USE_TEXTURE_COLOR
#define USE_REFLECTIONS
#define colorTex texture(tex0, vUv)
#define noiseTex texture(tex1, vUv)
///////////////////////////////////////////
vec4 displacement(vec3 p){
   	//p.x/=resolution.x/resolution.y;
    vec3 tex = textureLod(tex0, p.xz/12.+vec2(-0.2, 0.55), 0.0).rgb; //p.xz/9
    tex = clamp(tex, vec3(0.), vec3(1.));
    return vec4(length(tex),tex);
}
////////BASE OBJECTS///////////////////////
float obox( vec3 p, vec3 b ){ return length(max(abs(p)-b,0.0));}

float sdBox2(vec3 p, vec3 s) {
    p = abs(p)-s;
	return length(max(p, 0.))+min(max(p.x, max(p.y, p.z)), 0.);
}
mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float smax( float a, float b, float k ){
    float h = max(k-abs(a-b),0.0);
    return max(a, b) + h*h*0.25/k;
}

float smin( float a, float b, float k ){
    float h = max(k-abs(a-b),0.0);
    return min(a, b) - h*h*0.25/k;
}

////////MAP////////////////////////////////
vec4 map(vec3 p){

    float box = 0.;
    float x = 8.;
    float z = x*resolution.y/resolution.x; //x*resolution.y/resolution.x    TODO: FIX RES PROBLEMS
    vec4 disp = displacement(p+vec3(x, 1., 0.));
    float y = disp.x*uDisplace;
    y = clamp(y, 0., 1.);

    if ( p.y > 0. )
		box = obox(p, vec3(x,y,z));
	else
		box = obox(p, vec3(1.));

  	float cut = p.y-0.25;
    float bb = sdBox2(vec3(p.xy, p.z)-vec3(0, 0., .0), vec3(7.));
  	bb = abs(bb) - 0.21;

    float d = smax(cut, bb, 0.01 );
  	d = smin(d, box, 1.);
    
    //add plane
    d = smin(d, p.y+y, 2.51);

  	if(!depthFlag && box < bb){
  		disp.y = p.y;
  	}

    return vec4(d, disp.yzw);
}

float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax ){
	float res = 1.0;
    float t = mint;
    for( int i=0; i<16; i++ )
    {
		float h = map( ro + rd*t ).x;
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

vec3 calcNormal( in vec3 pos )
{
	vec3 eps = vec3( 0.05, 0.0, 0.0 );
	vec3 nor = vec3(
	    map(pos+eps.xyy).x - map(pos-eps.xyy).x,
	    map(pos+eps.yxy).x - map(pos-eps.yxy).x,
	    map(pos+eps.yyx).x - map(pos-eps.yyx).x );
	return normalize(nor);
}

float calcAO( in vec3 pos, in vec3 nor ){
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<16; i++ ){
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );
}

// ray marching
float march(vec3 ro, vec3 rd, float rmPrec, float maxd, float mapPrec){
    float s = rmPrec;
    float d = 0.;
    for(int i=0;i<64;i++){
        if (s<rmPrec||s>maxd) break;
        s = map(ro+rd*d).x*mapPrec;
        d += s;
    }
    return d;
}

vec3 OrenNayarLightModel(vec3 rd, vec3 ld, vec3 n){
	vec3 col = vec3(1.);//cubeMap(uCubeMap, ld, uCubeMapSize.x).rgb;
	col = texture2D(tex0, vUv).rgb;
	float RDdotN = dot(-rd, n);
	float NdotLD = dot(n, ld);

    float aRDN = acos(RDdotN);
	float aNLD = acos(NdotLD);

	float mu = .3; // roughness

	float A = 1.-.5*mu*mu/(mu*mu+0.57);
    float B = .45*mu*mu/(mu*mu+0.09);

	float alpha = max(aRDN, aNLD);
	float beta = min(aRDN, aNLD);

	float albedo = 1.1;

	float e0 = 3.1;
	col *= vec3(albedo / 3.14159) * cos(aNLD) * (A + ( B * max(0.,cos(aRDN - aNLD)) * sin(alpha) * tan(beta)))*e0;

	return col;
}



////////MAIN///////////////////////////////
void main( ){

    float cam_a = uCam.x; // angle z
    float cam_e = uCam.y; // elevation
    float cam_d = uCam.z; // distance to origin axis
    vec3 camUp=ucamUpVector;//Change camere up vector here
  	vec3 camView=uCamView; //Change camere view here
  	float li = uLightIntensity; // light intensity
    float prec = 0.0000001; // ray marching precision
    float maxd = uRayMaxDistance; // ray marching distance max
    float refl_i = uRefelctionIntensity; // reflexion intensity
    float refr_a = uRefractionAngle; // refraction angle
    float refr_i = uRefractionIntensity; // refraction intensity
    float bii = .35; // bright init intensity
    float marchPrecision = .1; // ray marching tolerance precision

	vec2 uv = gl_FragCoord.xy / resolution.xy * 2. -1.;
    uv.x*=resolution.x/resolution.y;

    vec3 col = vec3(0.);
    vec3 ro = vec3(-sin(cam_a), cam_e, cam_a); //
  	vec3 rov = normalize(camView-ro);
    vec3 u = normalize(cross(camUp,rov));
  	vec3 v = cross(rov,u);
  	vec3 rd = normalize(rov + uv.x*u + uv.y*v);

    float b = bii;

    float d = march(ro, rd, prec, maxd, marchPrecision);

    if (d<maxd){
        vec2 e = vec2(-1., 1.)*0.005;
    	vec3 p = ro+rd*d;
        vec3 n = calcNormal(p);
        b=li;
        vec3 reflRay = reflect(rd, n);
		vec3 refrRay = refract(rd, n, refr_a); 
        vec3 cubeRefl = textureCube(skybox, reflRay).rgb * refl_i;
        vec3 cubeRefr = textureCube(skybox, refrRay).rgb * refr_i;
        #ifdef USE_REFLECTIONS
        col = cubeRefr+cubeRefl+pow(b, 1.);
        #endif
        #ifndef USE_OREN_NAYAR_LIGHT_MODEL
        // lighting
        float occ = calcAO( p, n );
        vec3  lig = normalize( uLigthPos );
        float amb = clamp( 0.5+0.5*n.y, 0.0, 1.0 );
        float dif = clamp( dot( n, lig ), 0.0, 1. );
	    float bac = clamp( dot( n, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-p.y,0.0,1.0);
        float dom = smoothstep( -0.1, 0.1, reflRay.y );
        float fre = pow( clamp(1.0+dot(n,rd),0.0,1.0), 2.0 );
        float spe = pow(clamp( dot( reflRay, lig ), 0.0, 1.0 ), 8.0);
        dif *= softshadow( p, lig, 0.02, 2.5 );
        dom *= softshadow( p, reflRay, 0.02, 2.5 );
        vec3 brdf = vec3(.0);
        brdf += 1.20*dif*vec3(1.00,1.0,1.0);
        brdf += 1.20*spe*vec3(1.00,0.90,0.60)*dif;
        brdf += 0.30*amb*vec3(0.50,0.70,1.00)*occ;
        brdf += 0.40*dom*vec3(0.50,0.70,1.00)*occ;
        brdf += 0.30*bac*vec3(0.25,0.25,0.25)*occ;
        brdf += 1.40*fre*vec3(1.00,1.00,1.00)*occ;
        brdf += 0.02;
        col = col*brdf;
        col = mix( col, vec3(0.), 1.0-exp( -0.0005*d*d ) );
	    col = pow(col, vec3(0.4554));

		depthFlag = false;
		if(map(p).y == 0.){
			//col *= vec3(0.85);
			//col += noiseTex.rgb*1.;
			//col *= clamp(col, 0., 1.);
		}
		#else
		col = OrenNayarLightModel(rd, reflect(rd,n), n);
		#endif
		
		#ifdef USE_TEXTURE_COLOR
		depthFlag = true;
		col = mix(col, map(p).yzw, .5);
		#endif
		
		// contrast
		col = col*0.6 + 0.4*col*col*(3.0-2.0*col);
		// saturation
		col = mix( col, vec3(dot(col,vec3(0.33))), 0.1 );
		// curves
		col = pow(col,vec3(0.85,0.95,1.0));
    }
    else
    {
        b+=0.1;
    }
	gl_FragColor.rgb = col;
	// gl_FragColor = texture2D(tex0, uv);
    // gl_FragColor = texture2D(tex0, uv);
	
}
