$=jQuery;var stateType={"init":0,"first":1,"second":2};var objLen=function(obj){var attr,len=0;for(attr in obj)if(obj.hasOwnProperty(attr))len++;return len;};var all=function(obj){var attr,res;if(objLen(obj)>0){res=true;for(attr in obj)if(obj.hasOwnProperty(attr)){if(!obj[attr]){res=false;break;}}}else{res=null;}return res;};var any=function(obj){var attr,res=true;if(objLen(obj)>0){res=false;for(attr in obj)if(obj.hasOwnProperty(attr)){if(obj[attr]){res=true;break;}}}else{res=null;}return res;};var pad=function(s){return(s<10)?'0'+s:s;};var StatusWidget=function(params,server,host,positionElID,language){this.params={};this.server=server;this.code="";this.data={djOnair:null,history:null,listeners:null};this.positionEl=$(positionElID);this.host=host;this._reqCounterRunner=0;this._reqCounterComplete=0;this.handler=null;this._spinner='<img src="'+this.host+'/media/static/images/ajax-loader.gif" />';this.language=language;this._init(params);};StatusWidget.prototype={defaults:{djImage:false,djName:true,listenersNum:true,trackCurrent:true,history:true,widgetWidth:350},tm:0x2710,template:'<table cellspacing="0" width="${params.widgetWidth}">'+'<thead>'+'<tr>'+'<th colspan="3">'+'{{if params.djImage}}'+'<div class="dj_img">{{if data.djOnair}}<img src="${data.djOnair.image}" />{{/if}}</div>'+'{{/if}}'+'{{if params.trackCurrent}}'+'<div class="header_info">'+'{{if data.djOnair }}<strong>${language == "en" ? "Now playing":"Сейчас в эфире"}:</strong> ${data.djOnair.metadata}{{/if}}'+'</div>'+'{{/if}}'+'{{if params.djName}}'+'<div class="header_info2">{{if data.djOnair}}${language == "en" ? "Dj":"Диджей"}: ${data.djOnair.name}{{/if}}</div>'+'{{/if}}'+'{{if params.listenersNum}}'+'<div class="header_info2">${language == "en" ? "Listeners":"Слушателей"}: ${data.listeners}</div>'+'{{/if}}'+'</th>'+'</tr>'+'</thead>'+'<tbody>'+'{{if params.history}}'+'<tr><th colspan="3">${language == "en" ? "Song history":"История эфира"}</th></tr>'+'{{/if}}'+'{{each(i, h) data.history}}'+'<tr><td colspan="3">${h.metadata}</td></tr>'+'<tr class="even">'+'<td title="Время" width="10">${h.dttm}</td>'+'<td title="Диджей в эфире" width="10">${h.dj_name}</td>'+'<td title="Количество слушателей">{{if params.listenersNum}}${h.n_listeners}{{else}}&nbsp;{{/if}}</td>'+'</tr>'+'{{/each}}'+'</tbody>'+'</table>',api:{'djOnair':"/api/djs/?server={{server}}&active=true&connected=true&on_air=true&limit=1",'history':"/api/history/?server={{server}}&limit=10",'listeners':"/api/channels/?server={{server}}&limit=100"},api_relation:{'djOnair':["djImage","djName","trackCurrent"],'history':["history"],'listeners':["listenersNum"]},data_table:{'djOnair':'getDJ','history':'getHistory','listeners':'getListeners'},_init:function(params){$.template("template",this.template);var attr;for(attr in this.defaults)if(this.defaults.hasOwnProperty(attr)){this.params[attr]=(params.hasOwnProperty(attr))?params[attr]:false;}this.positionEl.html(this.spinner);this.getData();},getDJ:function(data){this.data.djOnair=(data.objects.length)?data.objects[0]:null;},getHistory:function(data){var k,v;var objects=[];for(k in data.objects)if(data.objects.hasOwnProperty(k)){v=data.objects[k];var d=new Date(0);d.setUTCSeconds(v.ts);dttm=d.toTimeString().split(' ')[0];objects.push({dj_name:v.dj_name,metadata:v.metadata,dttm:dttm,n_listeners:v.n_listeners});}this.data.history=objects;},getListeners:function(data){var attr,el,summ=0;for(attr in data.objects)if(data.objects.hasOwnProperty(attr)){summ+=data.objects[attr].listeners_air;}this.data.listeners=summ;},getData:function(){var attr;for(attr in this.api_relation)if(this.api_relation.hasOwnProperty(attr)){var k,val,arr=[];val=this.api_relation[attr];for(k in val){arr.push(this.params[val[k]]);}if(any(arr)){this._reqCounterRunner++;this._pushRequest(attr);}}},_pushRequest:function(attr){var that=this;$.ajax({url:this.host+this.api[attr].replace('{{server}}',this.server),type:"GET",dataType:"jsonp",complete:function(){that._reqCounterComplete++;if(that._reqCounterRunner===that._reqCounterComplete){that._reqCounterRunner=0;that._reqCounterComplete=0;that.render();}},success:function(data){that[that.data_table[attr]](data);}});},render:function(){this.renderInit();var attr;for(attr in this.data)if(this.data.hasOwnProperty(attr)){this.data[attr]=null;}},renderInit:function(){this.code=$.tmpl("template",{params:this.params,data:this.data,host:this.host,language:this.language});this.positionEl.html($(this.code));var that=this;this.handler=setTimeout(function(){that.getData();},that.tm);},destroy:function(){clearTimeout(this.handler);this.positionEl.empty();}};
