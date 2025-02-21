const pageTuringShader = `
/*
 * Original shader from: https://www.shadertoy.com/view/ltdXzX
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform sampler2D iChannel0;
uniform float time;
uniform vec2 resolution;

// shadertoy globals
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
/*
"Page Turning" by Emmanuel Keller aka Tambako - December 2015
License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
Contact: tamby@tambako.ch
*/

const float pi = 3.14159;
const float twopi = 6.28319;

const float e0 = 0.018;
const float ppow = 2.0;

const float bcolorMix = 0.67;
const float maxBcolVal = 0.4;

const float diffint = 1.2;
const float ambientt = 0.1;
const float ambientb = 0.4;

const vec2 specpos = vec2(0.85, -0.2);
const float specpow = 5.;
const float specwidth = 0.4;
const float specint = 0.6;

const vec2 shadowoffset = vec2(0.07, -0.04);
const float shadowsmoothness = 0.012;
const float shadowint = 0.25;

const float aawidth = 0.7;
const int aasamples = 3;

const bool showpoints = false;
const bool colors = false;
const bool anim = true;

//#define swap_x

// Simple "random" function
float random(float co)
{
    return fract(sin(co*12.989) * 43758.545);
}

vec4 getPagebackColor()
{
    
    float cn = 1.0;
    vec4 pagebackColor;
    pagebackColor.r = maxBcolVal*random(cn + 263.714);
    pagebackColor.g = maxBcolVal*random(cn*4. - 151.894);
    pagebackColor.b = maxBcolVal*random(cn*7. + 87.548);
    pagebackColor.a = 0.0;
    return pagebackColor;
}

vec2 rotateVec(vec2 vect, float angle)
{
    float xr = vect.x*cos(angle) + vect.y*sin(angle);
    float yr = vect.x*sin(angle) - vect.y*cos(angle);
    return vec2(xr, yr);
}

// Curl function on the axis bottom left corner - corner of the sheet
float pageFunction(float x, float e)
{
    return pow(pow(x, ppow) - e, 1./ppow);
}

// Derivate of the curl function for light calculations
float pageFunctionDer(float x, float e)
{
    return pow(x, ppow - 1.)/pow(pow(x, ppow) - e, (ppow - 1.)/ppow);
}

vec4 turnPage(vec2 fragCoord)
{
	// General calculations
    vec2 uv = fragCoord.xy / iResolution.yy;
    float ratio = iResolution.x/iResolution.y;
    
    // As long as one doesn't click on the canvas, the animation runs
    vec2 mpoint;
    bool firstcycle;
    
    
    firstcycle = mod(iTime/3.5, 2.)<1.;
    mpoint = vec2(mod(iTime/3.5, 1.)*iResolution.x*2.0, pow(mod(iTime/3.5, 1.), 2.5)*iResolution.y/1.2 + 8.*smoothstep(0., 0.07, mod(iTime/3.5, 1.)));
   
    vec2 midmpoint = mpoint*0.5;
    float mdist = distance(fragCoord, mpoint);
    float e = e0*pow(mdist/iResolution.y, 2.) + 0.02*e0*smoothstep(0., 0.12, mdist/iResolution.y);
    float angle = - atan(mpoint.x/mpoint.y) + pi*0.5;
    
    vec2 uv2 = uv;
    #ifdef swap_x
    uv2.x = ratio - uv2.x;
    #endif
    
    vec2 uvr = rotateVec(uv2 - midmpoint/iResolution.yy, angle);
    
    float pagefunc = pageFunction(uvr.x, e);
    vec2 uvr2 = vec2(pagefunc, uvr.y); 
    vec2 uvr3 = rotateVec(uvr2, -angle) - vec2(1., -1.)*midmpoint/iResolution.yy;
    
    vec2 uvr2b = vec2(-pagefunc, uvr.y); 
    vec2 uvr3b = rotateVec(uvr2b, -angle) - vec2(1., -1.)*midmpoint/iResolution.yy;
    
    #ifdef swap_x
    uvr3b.x = ratio - uvr3b.x;
    #endif
        
    vec4 i; 
    // Turned page
    if (uvr.x>0. && uvr3b.y>0.)
    {
        vec2 uvcorr = vec2(ratio, 1.);
        vec2 uvrcorr = rotateVec(uvcorr - midmpoint/iResolution.yy, angle);
        float pagefunccorr = pageFunction(uvrcorr.x, e);
        vec2 uvrcorr2 = vec2(-pagefunccorr, uvrcorr.y); 
        vec2 uvrcorr3 = rotateVec(uvrcorr2, -angle) - vec2(1., -1.)*midmpoint/iResolution.yy;
    
        float pagefuncder = pageFunctionDer(uvr.x, e);
        float intfac = 1. - diffint*(1. - 1./pagefuncder);

        if(uvr3.x>=0. || uvr3.y<=0.)
        {
            // Top of the turned page           
        	float mdists = distance(fragCoord, mpoint)*0.7 - 55.;
        	float es = e0*pow(mdists/iResolution.y, 2.) + 0.02*e0*smoothstep(0., 0.08, mdist/iResolution.y);
        	vec2 uvrs = rotateVec(uv2 - midmpoint/iResolution.yy - shadowoffset, angle);
        	float pagefuncs = pageFunction(uvrs.x + 0.015, es - 0.001);
        	vec2 uvr2s = vec2(pagefuncs, uvrs.y); 
        	vec2 uvr3s = rotateVec(uvr2s, -angle) - vec2(1., -1.)*midmpoint/iResolution.yy;
        	float shadow = 1. - (1. - smoothstep(-shadowsmoothness, shadowsmoothness, uvr3s.x))*(1. - smoothstep(shadowsmoothness, -shadowsmoothness, uvr3s.y));
            
            float difft = intfac*(1. - ambientt) + ambientt;
        	difft = difft*(shadow*shadowint + 1. - shadowint)/2. + mix(1. - shadowint, difft, shadow)/2.;
            if (firstcycle)
                //i = difft*(colors?vec4(1., 0.3, 0.3, 1.):texture(iChannel0, mod((uvr3b - uvrcorr3)/vec2(-ratio, 1.), 1.)));
                i = vec4(0.0, 0.0, 0.0, 0.0);
            else
                //i = difft*(colors?vec4(1., 0.3, 0.3, 1.):texture(iChannel0, mod((uvr3b - uvrcorr3)/vec2(-ratio, 1.), 1.)));
                i = vec4(0.0, 0.0, 0.0, 0.0);
        }
        else
        {
            // Bottom of the turned page
            float diffb = intfac*(1. - ambientb) + ambientb;
        	float spec = pow(smoothstep(specpos.x - 0.35, specpos.x, intfac)*smoothstep(specpos.x + 0.35, specpos.x, intfac), specpow);
        	spec*= specint*pow(1. - pow(clamp(abs(uvr.y - specpos.y), 0., specwidth*2.), 2.)/specwidth, specpow);
			/*if (firstcycle)
                i = diffb*(colors?vec4(0.3, 1.0, 0.3, 1.):mix(texture(iChannel0, mod((uvr3 - uvrcorr3)/vec2(-ratio, 1.), 1.)), getPagebackColor(), bcolorMix));
            else
                i = diffb*(colors?vec4(0.3, 1.0, 0.3, 1.):mix(texture(iChannel0, mod((uvr3 - uvrcorr3)/vec2(-ratio, 1.), 1.)), getPagebackColor(), bcolorMix));
            */
            i = diffb*(colors?vec4(0.3, 1.0, 0.3, 1.):texture(iChannel0, mod((uvr3 - uvrcorr3)/vec2(-ratio, 1.), 1.)));
         	//i = mix(i, vec4(1.0), spec);
        }
    }
    else
    {
        // "Background" with simple shadow

        vec2 mpointbg = vec2(0.2, 0.01);
        vec2 midmpointbg = mpointbg*0.5;
        float mdistbg = distance(fragCoord, mpointbg);
        float ebg = e0*pow(mdistbg/iResolution.y, 2.) + 0.01*e0*smoothstep(0., 0.12, mdistbg/iResolution.y);
        float anglebg = 0.001; //- atan(mpointbg.x/mpointbg.y) + pi*0.5;
        vec2 uvrbg = rotateVec(uv - midmpointbg/iResolution.yy, anglebg);
        //float pagefuncbg = mix(uvrbg.x, pageFunction(uvrbg.x, ebg), clamp(uvrbg.x*5., 0., 1.));
        float pagefuncbg;
        if (uvrbg.x<0.15)
           pagefuncbg = uvrbg.x;
        else
           pagefuncbg = mix(uvrbg.x, pageFunction(uvrbg.x, ebg), smoothstep(mpoint.x/iResolution.x + 0.1, mpoint.x/iResolution.x, uvrbg.x));
        
        vec2 uvr2bbg = vec2(-pagefuncbg, uvrbg.y); 
        vec2 uvr3bbg = rotateVec(uvr2bbg, -anglebg) - vec2(1., -1.)*midmpointbg/iResolution.yy;
        vec2 uvcorrbg = vec2(ratio, 1.);
        vec2 uvrcorrbg = rotateVec(uvcorrbg - midmpointbg/iResolution.yy, anglebg);
        float pagefunccorrbg = pageFunction(uvrcorrbg.x, ebg);
        vec2 uvrcorr2bg = vec2(-pagefunccorrbg, uvrcorrbg.y); 
        vec2 uvrcorr3bg = rotateVec(uvrcorr2bg, -anglebg) - vec2(1., -1.)*midmpointbg/iResolution.yy;       
        float pagefuncderbg = pageFunctionDer(uvrbg.x, ebg);
        float intfacbg = 1. - diffint*(1. - 1./pagefuncderbg);
        float difftbg = intfacbg*(1. - ambientt) + ambientt;
        
        if (firstcycle) 
            //i = colors?difftbg*vec4(0.3, 0.3, 1., 1.):texture(iChannel0, mod((uvr3bbg - uvrcorr3bg)/vec2(-ratio, 1.), 1.));
            i = vec4(0.0, 0.0, 0.0, 0.0);
        else
            //i = colors?difftbg*vec4(0.3, 0.3, 1., 1.):texture(iChannel0, mod((uvr3bbg - uvrcorr3bg)/vec2(-ratio, 1.), 1.));
            i = vec4(0.0, 0.0, 0.0, 0.0);
        float bgshadow = 1. + shadowint*smoothstep(-0.08+shadowsmoothness*4., -0.08, uvr3b.y) - shadowint;
        
        if (uvr3b.y<0.)
           i*= bgshadow;
    }
    return i;
}
 
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Antialiasing
    vec4 vs = vec4(0.);
    for (int j=0;j<aasamples ;j++)
    {
       float oy = float(j)*aawidth/max(float(aasamples-1), 1.);
       for (int i=0;i<aasamples ;i++)
       {
          float ox = float(i)*aawidth/max(float(aasamples-1), 1.);
          vs+= turnPage(fragCoord + vec2(ox, oy));
       }
    }
    vec4 i = vs/vec4(aasamples*aasamples);    
    
    // Show the mouse points. Was only used for development
    vec4 ocol; 
    if (showpoints)
    {
        float ratio = iResolution.x/iResolution.y;
        vec2 mpoint = vec2(0.0, 0.0);
        vec2 midmpoint = mpoint*0.5;
        float mdist = distance(fragCoord, mpoint);
        float midmdist = distance(fragCoord, midmpoint);
        
        ocol = mix(i, vec4(1., 0., 0., 1.), smoothstep(6., 4., mdist));
        ocol = mix(ocol, vec4(1., 1., 0., 1.), smoothstep(6., 4., midmdist));
    }
    else
        ocol = i;
        
    fragColor = i;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
class AnimsManager extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
    }
    get_big_window_move_anim(window, on_complete = () => { }) {
        let duration_anim = 1000;
        let mask_window_shape = new Phaser.GameObjects.Polygon(this.scene, 0, 0, [
            0, 0,
            game_size.width * 2, 0,
            0, game_size.height * 2
        ], 0x000000);
        mask_window_shape.setOrigin(0, 0);
        console.log(mask_window_shape);
        let mask_window = mask_window_shape.createGeometryMask();
        window.setMask(mask_window);
        this.scene.tweens.add({
            targets: mask_window_shape,
            // angle: -30,
            scale: 0,
            duration: duration_anim,
            onComplete: () => {
                on_complete();
            }
        });
        // let anim_image = new Phaser.GameObjects.Image(this.scene, game_size.width - 200, game_size.height - 200, 'page_turing');
        // anim_image.setAngle(10);
        // this.scene.add.existing(anim_image);
        // this.scene.tweens.add({
        //     targets: anim_image,
        //     x: 0,
        //     y: 0,
        //     scale: 5,
        //     duration: duration_anim,
        //     onComplete: () => {
        //         anim_image.destroy();
        //     }
        // });
        let cell_width = global_data.cell_width;
        let bg = new Phaser.GameObjects.Graphics(this.scene);
        bg.fillStyle(0xE9E8E3, 1);
        bg.fillRect(0, 0, game_size.width, game_size.height);
        let count_y = Math.ceil(game_size.height / cell_width);
        let count_x = Math.ceil(game_size.width / cell_width);
        bg.lineStyle(2, 0x6171A4, 0.7);
        for (let y = 0; y <= count_y; y++) {
            bg.lineBetween(0, y * cell_width, game_size.width, y * cell_width);
        }
        for (let x = 0; x <= count_x; x++) {
            bg.lineBetween(x * cell_width, 0, x * cell_width, game_size.height);
        }
        bg.lineStyle(7, 0xCF4038, 0.9);
        bg.lineBetween(0, 3 * cell_width, game_size.width, 3 * cell_width);
        this.scene.tweens.add({
            targets: bg,
            angle: -10,
            scale: 1.5,
            x: -150,
            y: 100,
            duration: duration_anim
        });
        let mask_anim_shape = new Phaser.GameObjects.Polygon(this.scene, game_size.width, game_size.height, [
            0, 0,
            game_size.width, 0,
            0, game_size.height
        ], 0x000000);
        mask_anim_shape.scale = 0;
        mask_anim_shape.setOrigin(1, 1);
        let mask_anim = mask_anim_shape.createGeometryMask();
        bg.setMask(mask_anim);
        window.add(bg);
        this.scene.tweens.add({
            targets: mask_anim_shape,
            // angle: -15,
            scale: 1,
            duration: duration_anim / 2,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: mask_anim_shape,
                    // angle: -30,
                    x: game_size.width / 2,
                    y: game_size.height / 2,
                    duration: duration_anim / 2,
                    onComplete: () => {
                    }
                });
            }
        });
        let anim_shape = new Phaser.GameObjects.Polygon(this.scene, game_size.width, game_size.height, [
            0, 0,
            game_size.width, 0,
            0, game_size.height
        ], 0x000000);
        anim_shape.setFillStyle(0x000000, 0);
        anim_shape.setStrokeStyle(7, 0x000000, 0.5);
        anim_shape.scale = 0;
        anim_shape.setOrigin(1, 1);
        window.add(anim_shape);
        this.scene.tweens.add({
            targets: anim_shape,
            // angle: -15,
            scale: 1,
            duration: duration_anim / 2,
            onUpdate: (tween) => {
                // let progress = tween.progress;
                // let distortion = Math.sin(progress * Math.PI) * 200; // Пример искажения
                let value = tween.getValue();
                mask_anim_shape.setTo([
                    0, value * 200,
                    game_size.width, 0,
                    0, game_size.height
                ]);
                anim_shape.setTo([
                    0, value * 200,
                    game_size.width, 0,
                    0, game_size.height
                ]);
            },
            onComplete: () => {
                this.scene.tweens.add({
                    targets: anim_shape,
                    // angle: -30,
                    x: game_size.width / 2,
                    y: game_size.height / 2,
                    duration: duration_anim / 2,
                    onComplete: () => {
                    }
                });
            }
        });
        // const baseShader = new Phaser.Display.BaseShader('BufferShader', pageTuringShader);
        // const shader = this.scene.add.shader(baseShader, 400, 300, 800, 600);
    }
}
