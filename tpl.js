function tpl(){
	var _self=this;
	this.content=[];
	this.parseC=function(c){
		var id=""; var cl="";
		if (c.substr(0,1)=="#"){ 
			var cc=c.split(/ /g);
			if (cc.length>1){
				id=cc.deleteAt(0)[0].substr(1);
				var cl=cc.join(" ");
			}
			else id=c.substr(1);
		}
		else var cl=c;
		return {id:id,cl:cl};
	},

	this.extras=function(ob){
		var dd=""; var c_ext="";
		if(typeof ob=="object"){
			$j.each(ob,function(k,v){ 	
				if (_self.eh[k]) dd+=_self.eh[k](v);
				else if (k=="custom"){
					if(undefined==_self.cf_ref[v.nm])
						_self.cf_ref[v.nm]={fn:v.fn,pp:[]};
					var pos=_self.cf_ref[v.nm].pp.push(v.p);
					dd+=" data-tpl-cfname='"+v.nm+"' data-tpl-cfpos='"+(pos-1)+"' ";
				}
			});
		}
		return {dd:dd,c_ext:c_ext}; //data-attr  or class
	},
		this.cf_ref={},

	this.w=function(c,ob){ 
		var ex=this.extras(ob);
		var f=this.parseC(c);
		if (f.id) var id=" id='"+f.id+"' ";
		else var id="";
		this.content.push("\n<div "+id+" class='"+f.cl+" "+ex.c_ext+"' "+ex.dd+">");
	}
	this.insert=function(str){
		this.content[this.content.length-1]+=str;
	}

	this.ww=function(sel){
		//end currenet wrap
		this.content[this.content.length-1]+="\n</div>"; //close the current wrap

		if (this.content.length>1){
			var chunk=this.content.pop(); //remove it from the set
			this.content[this.content.length-1]+=chunk; //add it to upper wrap
		}
		else{ //it's the top wrap, so just leave it there
			if (sel!=undefined){ 
				this.r(sel);
			}
		}
	}
	this.sib=function(c,txt,ob){
		var ex=this.extras(ob);
		var f=this.parseC(c);
		if (f.id) var id=" id='"+f.id+"' "; else var id="";
		//log("<div "+id+" class='"+f.cl+" "+ex.c_ext+"' "+ex.dd+">");
		this.content[this.content.length-1]+="\n\t<div "+id+" class='"+f.cl+" "+ex.c_ext+"' "+ex.dd+">"+txt+"</div>";
	};
	this.siba=function(c,txt,ob){
		var ex=this.extras(ob);
		this.content[this.content.length-1]+="\n\t<a "+ex.dd+" class='"+c+" "+ex.c_ext+"'>"+txt+"</a>"; 
	}
	this.clr=function(){
		this.content[this.content.length-1]+="\n\t<div style='clear:both;'></div>";
	}

	this.d=function(txt,c){ return "<div class='"+c+"'>"+txt+"</div>"; };
	this.a=function(txt,c){ return "<a class='"+c+"'>"+txt+"</a>"; };
	this.r=function(sel){ 	
		//log(this.content[0]);
		var scope=$j(sel).html(this.content[0]); 
		this.content=[]; //clear the content array
		this.listen(scope);
	};

	this.eh={
		tog:function(c){ //when target is a child or sibling
			return "data-tpl-tog='"+c+"'";
		},
		togp:function(c){ //when target is a child or sibling
			return "data-tpl-togp='"+c+"'";
		}
	}
	this.listen=function(scope){
		$j("[data-tpl-tog]",scope).bind("click",function(){
			var t=$j(this).data("tpl-tog");
			$j("."+t,$j(this).parent()).toggle();
		});
		$j("[data-tpl-togp]",scope).bind("click",function(){
			var t=$j(this).data("tpl-togp");
			$j("."+t,$j(this).parent().parent()).toggle();
		});

		$j("[data-tpl-cfname]",scope).each(function(k,v){
			var ref=_self.cf_ref[$j(v).data("tpl-cfname")];
			var p=ref.pp[ $j(v).data("tpl-cfpos") ];
			//$(v).data("cf_params",p).bind("click",p;
			$j(v).bind("click",p,ref.fn);
		});
		//clear the cf_ref
		_self.cf_ref={};
	}
}
