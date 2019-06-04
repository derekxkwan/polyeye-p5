//credit for shrimp img: https://commons.wikimedia.org/wiki/File:NCI_steamed_shrimp.jpg


let cw = window.innerWidth;
let ch = window.innerHeight;

let eye_src, eyes;
let eye_maxw, eye_maxh;
let swell_state;

let swell_mininc = 0.25;
let swell_maxinc = 0.75;
let swell_max = 200.0;
let min_prop = 0.75
let bg_gfx;
let dim = 150;
let nx = Math.floor(cw/dim);
let ny = Math.floor(ch/dim);
let num_poly = nx * ny;
let min_swell = 0.35;
let max_swell = 1.0;
let swell_rng = max_swell - min_swell;

let old_bg = [0,0,0];
let new_bg = [0,0,0];
let bg_ramp = 3500;
let bg_start = 0;
let bg_weights = [[0.0,0.15], [0.02, 0.04], [0.15, 0.15]];
var shrimp;


let num_eyes = 30;


var polys = [];
var s_dur = [];

let cstr = ["YOUNGESTATTHEDOCTOR", "EYEDROPSATNIGHT", "REFRIGERATEDMEDICATION", "EYEACHE", "PERIPHERALVISION"];


let eye_pos, eye_swell, eye_dim, eye_img, eye_alpha;
let slice_idx;
let num_slices = 50;
let slice_prop;
let slice_dir;
let slice_max = 90;
let slice_width;
let horiz = false;
let src_dim = [[509, 213], [458, 217]];

function preload(){
    //getting dims for images only returns 1 ?!
    let eye1 = loadImage('assets/eye1b.png');
    let eye2 = loadImage('assets/eye2b.png');
    //eye_maxw = Math.max(eye1.width, eye2.width);
    //eye_maxh = Math.max(eye1.height, eye2.height);

    eye_src = [eye1, eye2];
    }

function slice_instantiate(eye_idx)
{
    if(horiz == true)
    {
	slice_prop[eye_idx] = Array.from({length: num_slices}, (x, i) => random(0.01,1.0));
	slice_dir[eye_idx] = Array.from({length: num_slices}, (x, i) => coin_flip());
    }
    else
    {
	slice_prop[eye_idx] = Array.from({length: num_slices}, (x, i) => random(0.01,1.0));
	slice_dir[eye_idx] = Array.from({length: num_slices}, (x, i) => 1.0);
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

function disp_bg(cur_time)
{
    let cur_pos = cur_time - bg_start;

    bg_gfx.colorMode(HSB, 255);
    if(cur_pos >= bg_ramp)
	{
	    old_bg = new_bg;
	    new_bg = new_bg_color();

	    bg_start = cur_time;
	};

    cur_pos = (cur_pos % bg_ramp)/bg_ramp;
    
    let ret_bg = old_bg.map(
	(old_clr, idx) =>
	    
	((new_bg[idx] - old_clr) * cur_pos) + old_clr
	
    );


    let ret_color = color(ret_bg[0], ret_bg[1], ret_bg[2], 150);

    bg_gfx.fill(ret_color);
    bg_gfx.noStroke();
    bg_gfx.rect(0,0,cw, ch);
    image(bg_gfx, 0, 0, cw, ch);

    
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
    createCanvas(cw,ch);
    bg_gfx = createGraphics(cw,ch);
    old_bg = new_bg_color();
    new_bg = new_bg_color();
    bg_ramp = 1250 + random(1750);
    bg_start = millis();
    eye_swell = Array.from({length: num_eyes}, (x) => Math.floor(2500 + random(7500)));

    slice_idx = Array.from({length: num_eyes});
    slice_width = Array.from({length: num_eyes});
    slice_prop = Array.from({length: num_eyes});
    slice_dir = Array.from({length: num_eyes});
    eyes = Array.from({length: num_eyes});
    eye_dim = Array.from({length: num_eyes});
    eye_img = Array.from({length: num_eyes});
    eye_pos  = Array.from({length: num_eyes});
    swell_state = Array.from({length: num_eyes}, (x) => 0);

    swell_inc = Array.from({length: num_eyes}, () => random(0.25, 1.25));
    swell_dir = Array.from({length: num_eyes}, () => coin_flip());
    eye_alpha = Array.from({length: num_eyes}, () => Math.floor(55 + random(200)));

    
    for(let i =0; i < num_eyes; i++)
    {
	let cur_srcidx = Math.floor(random(eye_src.length));
	let eye_maxw = src_dim[cur_srcidx][0];
	let eye_maxh = src_dim[cur_srcidx][1];
	let cur_prop = random(0.25, 1.25);
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

	eyes[i].tint(255, eye_alpha[i]);
	eyes[i].image(eye_img[i], 0, 0, cur_w, cur_h);

    };


    for(let i = 0; i < num_poly; i++)
	{
	    let cur_str = cstr[Math.floor(random(cstr.length))];
	    let c_c1 = color(random(256), random(256), random(256));
	    let c_c2 = color(random(256), random(256), random(256));
	    let c_dur = random(600) + 150;
	    //let c_dur = 125;
	    let c_cx = (i % nx) * dim;
	    let c_cy = Math.floor(i/nx) * dim;
	    let c_sdur = Math.round(1000 + random(2500));
	    let cur_poly = new PolyVisSq(cur_str, c_c1, c_c2, c_dur, c_cx, c_cy, dim);
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
	let cur_slice = slice_idx[eye_idx][i];
	let cur_prop = slice_prop[eye_idx][i];
	let cur_dir = slice_dir[eye_idx][i];
	let cur_amt = cur_prop*cur_dir*cur_swell;
	if(horiz == true)
	    shift_line(cur_eye, 0, eye_pos[eye_idx][0], eye_pos[eye_idx][1], cur_slice , cur_amt, width, cur_h, slice_width[eye_idx]);
	else
	    shift_line(cur_eye, 1, eye_pos[eye_idx][0], eye_pos[eye_idx][1],  cur_slice , cur_amt, cur_w, height, slice_width[eye_idx]);
	//console.log(cur_prop, cur_dir, cur_swell, cur_amt);
    };

}

function draw() {
  // put drawing code here
    let cur_time = millis();
    clear();
    disp_bg();
    bg_gfx.background(0);
    disp_bg(cur_time);
    eyes.forEach((eye, idx) =>
		{
		    //tint(255, eye_alpha[idx]);
		    eye_draw(eye,idx);
		    //disp_img(eye, idx, cur_time);
		  }
		);

    //colorMode(RGB, 255);


    //for(let i=0; i < num_eyes; i++) image(eyes[i], width/num_eyes*i, height/num_eyes);

    //poly_draw(cur_time);


    
}

// neg shift = shift left.
function shift_line(img = null, horiz_vert = 0, x_off =0, y_off=0, idx = 0 , shift_amt = 0, cur_w = width, cur_h = height, chunk_size = 1)
{

    //horizontal
    if(horiz_vert == 0)
    {
	let cur_idx = idx < 0 ? 0 : (idx >= height ? height - 1 : idx);
	let cur_chunk = cur_idx + chunk_size >= height ? height - cur_idx : chunk_size;
	let cur_shift = shift_amt >= width ? width - 1 : (shift_amt <= (-1 * width) ? (-1 * width) + 1 : shift_amt);
	let dest_x = cur_shift + x_off;
	let dest_y = cur_idx + y_off;

	if(cur_shift > 0)
	{
	    let copy_width = cur_w - cur_shift;
	    if((dest_x >= 0 && dest_x < width) && (dest_y >= 0 && dest_y < height) && (x_off >= 0 && x_off < width))
	    {
		if(img)
		{
		    copy(img, 0, cur_idx, copy_width, cur_chunk, dest_x, dest_y, copy_width, cur_chunk);
		    copy(img, 0, cur_idx, 1, cur_chunk, x_off, dest_y, cur_shift, cur_chunk);
		}
		else
		{
		    copy(0, cur_idx, copy_width, cur_chunk, dest_x, dest_y, copy_width, cur_chunk);
		    copy(0, cur_idx, 1, cur_chunk, x_off, dest_y, cur_shift, cur_chunk);
		}
	    };

	}
	else if (cur_shift < 0)
	{
	    let copy_width = cur_w + cur_shift;
	    let dest_x2 = copy_width + x_off;
	    let dest_y2 = cur_chunk + y_off;
	    if((dest_x2 >= 0 && dest_x2 < width) && (dest_y >= 0 && dest_y < height) && (x_off >= 0 && x_off < width) && (dest_y2 >= 0 && dest_y2 < height))
	    {
		if(img)
		{
		    copy(img, cur_shift, cur_idx, copy_width, cur_chunk, x_off, dest_y, copy_width, cur_chunk);
		    copy(img, cur_w - 1, cur_idx, 1, cur_chunk, dest_x2, dest_y2, -1 * cur_shift, cur_chunk);
		}
		else
		{
		    copy(cur_shift, cur_idx, copy_width, cur_chunk, x_off, dest_y, copy_width, cur_chunk);
		    copy(cur_w - 1, cur_idx, 1, cur_chunk, dest_x2, dest_y2, -1 * cur_shift, cur_chunk);
		};
	    };
	};
	
    }
    else
	{
      //vertical
	    let cur_idx =  idx < 0 ? 0 : (idx >= width ? width - 1  : idx);
	    let cur_chunk = idx + chunk_size >= width ? width  - idx : chunk_size;
	    let cur_shift = shift_amt >= height ? height - 1 : (shift_amt <= (-1 * height) ? (-1 * height) + 1 : shift_amt);
	    let dest_x = cur_idx  + x_off;
	    let dest_y = cur_shift + y_off;

	    if(cur_shift > 0)
	    {
		let copy_height = cur_h - cur_shift;
		if((y_off >= 0 && y_off < height) && (dest_x >= 0 && dest_x < width) && (dest_y >= 0 && dest_y < height))
		{
		    if(img)
		    {
			copy(img, cur_idx, 0, cur_chunk, copy_height, dest_x, dest_y, cur_chunk, copy_height);
			copy(img, cur_idx, 0, cur_chunk, 1, dest_x, y_off, cur_chunk, cur_shift+1);
		    }
		    else
		    {
			copy(cur_idx, 0, cur_chunk, copy_height, dest_x, dest_y, cur_chunk, copy_height);
			copy(cur_idx, 0, cur_chunk, 1, dest_x, y_off, cur_chunk, cur_shift+1);
		    } 
		};
	    }
	    else if (cur_shift < 0)
	    {

		let copy_height = cur_h + cur_shift;
		let dest_y2 = copy_height + y_off;
		if((dest_x >= 0 && dest_x < width) && (y_off >= 0 && y_off < height) && (dest_y2  >= 0 && dest_y2 < height))
		{
		    if(img)
		    {
			copy(img, cur_idx, -1*cur_shift, cur_chunk, copy_height, dest_x, y_off, cur_chunk, copy_height);
			copy(img, cur_idx, cur_h - 1, cur_chunk, 1, dest_x, dest_y2, cur_chunk, -1 * cur_shift);
		    }
		    else
		    {
			copy(cur_idx, -1*cur_shift, cur_chunk, copy_height, dest_x, y_off, cur_chunk, copy_height);
			copy(cur_idx, cur_h - 1, cur_chunk, 1, dest_x, dest_y2, cur_chunk, -1 * cur_shift);
		    }
		};
	    };
							     
	};
}

function coin_flip()
{
    let cur = random(100);
    if(cur >= 50) return 1;
    else return -1;
}
