class PolyVisSq2 {
    encode_str(want_str)
    {
	let str_parsed = want_str.toLowerCase();
	let ret_arr = [];
	for(let i = 0; i < str_parsed.length; i++)
	{
	    let cur_code = str_parsed.charCodeAt(i) - 97;
	    //account for out of range
	    cur_code = (cur_code > 25 || cur_code < 0) ? -1 : cur_code;
	    //account for i/j overlap
	    if(cur_code >= 9) cur_code = cur_code - 1;
	    ret_arr.push(cur_code);
	    
	};

	return ret_arr;
    }
    
    constructor(want_str, clr1, clr2, ltr_dur, cx, cy, dim)
    {
	this.gfx = createGraphics(dim, dim);
	this.cx = cx;
	this.cy = cy;
	this.clr1 = clr1;
	this.clr2 = clr2;
	this.ltr_dur = parseInt(ltr_dur);
	this.start_time  = millis();
	this.encoded = this.encode_str(want_str);
	this.len = this.encoded.length;
	this.word_dur = parseInt(this.len * this.ltr_dur);
	this.dim =  dim;
	this.gfx.colorMode(HSB);
    }

    get_cur_ltr(cur_time)
    {
	let time_since_start = cur_time - this.start_time;
	let mod_time = time_since_start % this.word_dur;
	let ltr_idx = Math.floor(mod_time/this.ltr_dur);
	return this.encoded[ltr_idx];
    }
    
    reset()
    {
	this.start_time = millis();
    }
    
    draw(cur_time)
    {
	let cur_ltr = this.get_cur_ltr(cur_time);

	//this.gfx.background(this.clr1);
	this.gfx.clear();
	this.gfx.stroke(this.clr1);
	this.gfx.strokeWeight(10);
	this.gfx.noFill();
	this.gfx.square(0,0,this.dim);
	if(cur_ltr >= 0)
	    {
		let cur_y = Math.floor(cur_ltr/5.0) % 5;
		let cur_x = cur_ltr % 5;
		let sq_dim = Math.round(this.dim/5.0);
		this.gfx.strokeWeight(6);
		this.gfx.stroke(this.clr2);
		this.gfx.square(cur_x*sq_dim, cur_y*sq_dim, sq_dim);
	    };
    }

    set_str(want_str)
    {
	this.encoded = encode_str(want_str);
	this.len =  this.encoded.length;
	this.word_len = parseInt(this.len * this.ltr_dur);
    }

    set_dur(want_dur)
    {
	this.ltr_dur =  want_dur;
	this.word_len = parseInt(this.len * this.ltr_dur);
    }
};

