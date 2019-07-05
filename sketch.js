
let cw = window.innerWidth;
let ch = window.innerHeight;

let eye_src, eyes;
let eye_maxw, eye_maxh;
let swell_state;

let swell_mininc = 1.75;
let swell_maxinc = 7.00;
let swell_max = 100.0;
let swell_inc, swell_dur;
let min_prop = 0.75;
let bg_gfx;
let dim = 150;
let nx = Math.floor(cw/dim);
let ny = Math.floor(ch/dim);
let num_poly = nx * ny;
let min_swell = 0.35;
let max_swell = 1.0;
let swell_rng = max_swell - min_swell;


let poly_xpad = 10, poly_ypad = 10;

let num_eyes = 100;

let loaded = false;

var polys = [];
var s_dur = [];

let cstr = ["YOUNGESTATTHEDOCTOR", "EYEDROPSEVERYDAY", "REFRIGERATEDMEDICATION", "OPENANGLE", "INTRAOCULARPRESSURE", "VISUALFIELDTEST", "CUPTODISCRATIO", "BACKOFEYEPICTURES", "EYELIDASSISTANCE", "NUMBINGEYEDROPS", "LONGEYELASHES", "EYEDILATION", "PERMANENTVISIONLOSS", "AIRPUFFTEST", "OPTICNERVEDAMAGE"];


let eye_pos, eye_swell, eye_dim, eye_img, eye_alpha;
let slice_idx;
let num_slices = 25;
let slice_prop;
let slice_dir;

let slice_width;
let horiz = true;
let src_dim = [[509, 213], [458, 217]];

function mobile_or_tablet() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function preload(){
    //getting dims for images only returns 1 ?!
    let eye1 = loadImage("assets/eye1ic2.png");
    let eye2 = loadImage("assets/eye2ic2.png");
    //eye_maxw = Math.max(eye1.width, eye2.width);
    //eye_maxh = Math.max(eye1.height, eye2.height);

    eye_src = [eye1, eye2];

    loaded = true;
    }

function slice_instantiate(eye_idx)
{
    if(horiz == true)
    {
	slice_prop[eye_idx] = Array.from({length: num_slices}, (x, i) => random(0.75,2.75));
	slice_dir[eye_idx] = Array.from({length: num_slices}, (x, i) => coin_flip());
    }
    else
    {
	slice_prop[eye_idx] = Array.from({length: num_slices}, (x, i) => random(0.75,2.75));
	slice_dir[eye_idx] = Array.from({length: num_slices}, (x, i) => coin_flip());
    };
			   
}

//returns cx, cy, dim
function new_bg_color()
{
    return Array.from({length: 3}, (x, i) => Math.floor(random(bg_weights[i][0]*256, bg_weights[i][1]*256)));
}

function disp_img(cur_eye, eye_idx, cur_time)
{
    let ce_w = cur_eye.width;
    let ce_h = cur_eye.height;
    let cur_swell = eye_swell[eye_idx];
    let modtime = cur_time % cur_swell;
    let swell_pos = 1.0 - Math.abs(((modtime/cur_swell) * 2.0) - 1.0); //0 - 1
    let cur_prop = (swell_pos * (1.0 - min_prop)) + min_prop;
    let cur_w = ce_w * cur_prop;
    let cur_h = ce_h * cur_prop;
    let cur_x = eye_pos[eye_idx][0] - (cur_w/2.0);
    let cur_y = eye_pos[eye_idx][1] - (cur_h/2.0);
    //let cur_x = eye_pos[eye_idx][0];
    //let cur_y = eye_pos[eye_idx][1];
    //console.log(cur_prop);
    //console.log(cur_w, cur_h, cur_x, cur_y);
    image(cur_eye, cur_x, cur_y, cur_w, cur_h);
}


function  calc_coords(idx, cur_time)
{
    let c_cx = polys[idx].cx;
    let c_cy = polys[idx].cy;
    let c_sdur = s_dur[idx];
    let c_start_time =  polys[idx].start_time;
    let modtime = (cur_time - c_start_time) % c_sdur;
    let swell_pos = 1.0 - Math.abs(((modtime/c_sdur) * 2.0) - 1.0);
    let cur_swell = (swell_rng * swell_pos) + min_swell;
    let pos_offset =  (1.0 - swell_pos) * swell_rng * 0.5 * dim;
    return [c_cx + pos_offset, c_cy + pos_offset, cur_swell * dim];
    
    }

function setup() {
  // put setup code here
    let is_mobile = mobile_or_tablet();
    alert(is_mobile);
    createCanvas(cw,ch);
    bg_gfx = createGraphics(cw,ch);
    frameRate(24);
    if(is_mobile == true) num_eyes = 20;

    eye_swell = Array.from({length: num_eyes}, (x) => Math.floor(10000 + random(7500)));

    slice_idx = Array.from({length: num_eyes});
    slice_width = Array.from({length: num_eyes});
    slice_prop = Array.from({length: num_eyes});
    slice_dir = Array.from({length: num_eyes});
    eyes = Array.from({length: num_eyes});
    eye_dim = Array.from({length: num_eyes});
    eye_img = Array.from({length: num_eyes});
    eye_pos  = Array.from({length: num_eyes});
    swell_state = Array.from({length: num_eyes}, (x) => 0);

    swell_inc = Array.from({length: num_eyes}, () => random(swell_mininc, swell_maxinc));
    swell_dir = Array.from({length: num_eyes}, () => coin_flip());
    eye_alpha = Array.from({length: num_eyes}, () => Math.floor(random(100,215)));

    
    for(let i =0; i < num_eyes; i++)
    {
	let cur_srcidx = Math.floor(random(eye_src.length));
	let eye_maxw = src_dim[cur_srcidx][0];
	let eye_maxh = src_dim[cur_srcidx][1];
	let cur_prop = random(0.75, 2.5);
	let cur_w = Math.floor(eye_maxw * cur_prop);
	let cur_h = Math.floor(eye_maxh * cur_prop);
	eyes[i] = createGraphics(cur_w, cur_h);
	if(horiz == true) slice_width[i] = Math.round(cur_h/num_slices);
	else slice_width[i] = Math.round(cur_w/num_slices);

	slice_idx[i] = Array.from({length: num_slices}, (y,idx) => idx * slice_width[i]);

	eye_img[i] = eye_src[cur_srcidx];
	eye_pos[i] = [Math.floor(random(width+cur_w) - cur_w), Math.floor(random(height+cur_h) - cur_h)];
	slice_instantiate(i);
	eye_dim[i] = [eye_maxw, eye_maxh];
	//console.log(cur_srcidx, eye_maxw, eye_maxh, cur_w, cur_h);
	//console.log(cur_w, slice_width[i], slice_idx[i]);

	eyes[i].tint(360, eye_alpha[i]);
	eyes[i].image(eye_img[i], 0, 0, cur_w, cur_h);

    };


    colorMode(HSB);
    for(let i = 0; i < num_poly; i++)
	{
	    let cur_str = cstr[Math.floor(random(cstr.length))];
	    //let c_c1 = color(random(200, 206), random(200, 206), random(180, 256));
	    //let c_c2 = color(random(200, 206), random(200, 206), random(180, 256));	    
	    let c_c1 = color(random(280, 360), random(50, 100), random(80, 100));
	    //let c_c2 = color(random(300, 360), random(50, 100), random(90, 100));


	    let c_dur = random(750, 1750);
	    //let c_dur = 125;
	    let c_cx = (i % nx) * dim + poly_xpad;
	    let c_cy = Math.floor(i/nx) * dim + poly_ypad;
	    let c_sdur = Math.round(random(2500,5000));
	    let cur_poly = new PolyVisSq2(cur_str, c_c1, c_c1, c_dur, c_cx, c_cy, dim);
	    polys.push(cur_poly);
	    s_dur.push(c_sdur);
	};

}




function poly_draw(cur_time)
{
    
    for(let i=0; i < polys.length; i++)
    {
	let [cur_x, cur_y, cur_dim] = calc_coords(i, cur_time);
	polys[i].draw(cur_time);
	image(polys[i].gfx, cur_x, cur_y, cur_dim, cur_dim);
    };

}

function eye_draw(cur_eye, eye_idx)
{

    //cur_eye.image(eye_img[eye_idx], 0, 0, cur_eye.width, cur_eye.height);
    
    let cur_swell = swell_state[eye_idx];
    swell_state[eye_idx] += (swell_inc[eye_idx] * swell_dir[eye_idx]);
    if(swell_state[eye_idx] > swell_max) swell_dir[eye_idx] = -1.0;
    else if (swell_state[eye_idx] <= 0)
    {
	swell_dir[eye_idx] = 1.0;
	slice_instantiate(eye_idx);
	swell_inc[eye_idx] = random(swell_mininc, swell_maxinc);
    };

    for(let i=0; i < num_slices; i++)
    {
	let cur_w = cur_eye.width;
	let cur_h = cur_eye.height;
	//let cur_slice = slice_idx[eye_idx][i];
	let cur_prop = slice_prop[eye_idx][i];
	let cur_dir = slice_dir[eye_idx][i];
	let cur_amt = cur_prop*cur_dir*cur_swell;
	if(horiz == true)
	{

	    draw_strip(cur_eye, 0, eye_pos[eye_idx][0], eye_pos[eye_idx][1], i, cur_amt, slice_width[eye_idx]);
	}

	else
	{
	    draw_strip(cur_eye, 1, eye_pos[eye_idx][0], eye_pos[eye_idx][1], i, cur_amt, slice_width[eye_idx]);

	};
	//console.log(cur_prop, cur_dir, cur_swell, cur_amt);
    };

}

function draw() {
  // put drawing code here
    let cur_time = millis();

    if(loaded == true) {
    clear();
    //disp_bg();
    colorMode(RGB);
    //bg_gfx.background(0);
    //disp_bg(cur_time);
    background(30);
    eyes.forEach((eye, idx) =>
		{
		    //tint(255, eye_alpha[idx]);
		    eye_draw(eye,idx);
		    //disp_img(eye, idx, cur_time);
		  }
		);

    //colorMode(RGB, 255);


    //for(let i=0; i < num_eyes; i++) image(eyes[i], width/num_eyes*i, height/num_eyes);

    poly_draw(cur_time);
	}


    
}

function draw_strip(img, horiz_vert, dest_x, dest_y, cur_idx, shift_amt, strip_size)
{
    let s_x, s_y, d_x, d_y, c_w, c_h;
    // if we are starting within the bounds
    let can_draw = false, can_copy = false;
    let real_idx = cur_idx * strip_size;
    //horizontal
    if(horiz_vert == 0)
    {
	// strip dest idx we want
	let copy_x = 0;
	let copy_y = real_idx;
	let want_idx = real_idx + dest_y; //draw_y
	let want_shift = shift_amt + dest_x; //draw_x
	let want_h = strip_size;
	let want_w = img.width;
	if(want_shift + want_w >= width) want_w = width - want_shift;
	else if (want_shift < 0)
	{
	    copy_x = -1.0* want_shift;
	    want_w = want_w + want_shift;
	};
	if(want_idx  + want_h > height) want_h = height - want_idx;
	else if(want_idx < 0)
	{
	    copy_y = -1.0 * want_idx;
	    want_h = strip_size + want_idx;
	}
	can_draw = want_w > 0 && want_shift < width && want_idx < height;
	can_copy = real_idx < img.height && want_h > 0 && want_w > 0;

	d_x = want_shift;
	d_y = want_idx;
	c_w = want_w;
	c_h = want_h;
	s_y = real_idx;
	s_x = copy_x;
	s_y = copy_y;
    }
    else
    {
	// vertical
	let copy_x = real_idx;
	let copy_y = 0;
	let want_idx = real_idx + dest_x; //draw_x
	let want_shift = shift_amt + dest_y; //draw_y
	let want_h = img.height;
	let want_w = strip_size;
	if(want_shift + want_h >= height) want_h = height - want_shift;
	else if (want_shift < 0){
	    copy_y = -1.0* want_shift;
	    want_h = want_h + want_shift;
	};
	if(want_idx  + want_w > height) want_w = width - want_idx;
	else if(want_idx < 0)
	{
	    copy_x = -1.0 * want_idx;
	    want_w = strip_size + want_idx;
	};
	can_draw = want_w > 0 && want_shift < height && want_idx < width;
	can_copy = real_idx < img.width && want_h > 0 && want_w > 0;

	d_x = want_idx;
	d_y = want_shift;
	c_w = want_w;
	c_h = want_h;
	s_x = copy_x;
	s_y = copy_y;
	

	
    };

    if(can_draw && can_copy)
    {
	copy(img, s_x, s_y, c_w, c_h, d_x, d_y, c_w, c_h);
    }
}


function coin_flip()
{
    let cur = random(100);
    if(cur >= 50) return 1;
    else return -1;
}

window.onerror = function(error) {
    alert(error);
};
