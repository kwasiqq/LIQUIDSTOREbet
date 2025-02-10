var tgapp = window.Telegram.WebApp;
var idtg=tgapp.initDataUnsafe.user!=undefined?tgapp.initDataUnsafe.user.id:0;
var initdata=tgapp.initData!=undefined?tgapp.initData:'';
var mySmartPhoto=null;

function loader_on()
{
  $(".loader").addClass('visible');
}

function loader_off()
{
  if($(".loader").hasClass('visible'))
  $(".loader").removeClass('visible');
}

var _appalert=false;
function appalert(mes)
{
  if(!idtg)
  return;
  else if(!_appalert)
  tgapp.showAlert(mes);
}

function modcents(num)
{
  num=Math.round(num*100)/100;
  num=num.toString();
  if(/\.[0-9]{1}$/i.test(num))
  num+='0';
  let intdec=num.split('.');
  if(intdec[0].length<7)
  num=intdec[0].replace(/([0-9]{3})$/i," $1").trim();
  else
  num=intdec[0].replace(/([0-9]{3})([0-9]{3})$/i," $1 $2").trim();
  if(intdec[1]>0)
  return num+'.'+intdec[1];
  else
  return num;
}

$.urlParam = function(paramName,dvalue)
{ var _get = {};
  var __get = window.location.search.substring(1).split("&");
  for(var i=0;i<__get.length;i++)
  { var getVar = __get[i].split("=");
    _get[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
  }
  if(typeof _get[paramName]!='undefined')
  return _get[paramName];
  else
  return dvalue;
};

var popupwin = {

  load: function(url,post)
  { var loadingtimer=setTimeout(function(){ loader_on(); }, 1000);
    $.ajax({url: url,type:'post',data: post,success: function(response)
    { if(typeof loadingtimer != 'undefined')
      { clearTimeout(loadingtimer);
        loader_off();
      }
      if(response[0]==';')
      { $.globalEval(response);
        return;
      }
      else if(response)
      { $('#popupbox').html(response);
        popupwin.show();
      }
    }});
  },

  show: function()
  {
    $('input:focus').trigger('change');
    $("#popupbox .close-popup").click(function(e)
    { e.preventDefault();
      popupwin.hide();
    });
    $.each($("#popupbox form"),function(i,form)
    { $(form).find("input[name=initdata]").val(initdata);
      $(form).submit(function(e)
      { e.preventDefault();
        var loadingtimer=setTimeout(function(){ loader_on(); }, 1000);
        $.ajax(
        { type: 'post',
          url: $(form).attr('action'),
          data: $(form).serialize(),
          success: function(response)
          { if(typeof loadingtimer!='undefined')
            { clearTimeout(loadingtimer);
              loader_off();
            }
            if(response)
            $.globalEval(response);
          },
          error: function(xhr,str)
          { appalert('Что-то пошло не так.');
          }
        });
      });
    });

    mySmartPhoto = new SmartPhoto('#popupbox .js-smartphoto[href]',{useHistoryApi:false,swipeTopToClose:true});
    $('#popupbox .js-smartphoto[href]').on('swiped-left',function() { this.click(); });
    $('#popupbox .js-smartphoto[href]').on('swiped-right',function() { this.click(); });
    $('#popupbox input[enterkeyhint]').on('keydown',function(e) { if(/^13$|^27$|^9$/.test(e.keyCode)) this.blur(); });
    $('#popupbox').addClass('opened').animate({scrollTop:0},0);
    $("body").addClass('overflow-hidden');
    if(tgapp.shareMessage==undefined)
    $('.share-btn').remove();
    if($('#popupbox #orderform').length>0 && tgapp.SecondaryButton.isVisible)
    tgapp.SecondaryButton.hide();
    if($(window).height()==$('body').height())
    $('body').height($('body').height()+20);
    if($(window).scrollTop()<20)
    $('html,body').animate({scrollTop:'20px'},0);
  },

  hide: function()
  {
    $('input:focus').trigger('change');
    if($(window).scrollTop()<30)
    $('html,body').animate({scrollTop:0},0);
    $("#popupbox").removeClass('opened');
    $("body").removeClass('overflow-hidden');
    $('#popupbox').html('');
    $('.site-footer').show();
    mySmartPhoto=null;
    if(tgapp.MainButton.isVisible)
    tgapp.MainButton.hide();
    if(!$('.site-footer').length && tgapp.SecondaryButton.text!='КОРЗИНА')
    tgapp.SecondaryButton.show();
  }
};

function activateScrollHeader()
{ var mainHeader=$('.site-header');
  var scrolling=false,previousTop=0,currentTop=0,scrollDelta=5,scrollOffset=100;
  function hscroll()
  { if(!scrolling)
    { scrolling=true;
      (!window.requestAnimationFrame)?setTimeout(autoHideHeader,250):requestAnimationFrame(autoHideHeader);
    }
  }
  function autoHideHeader()
  { var currentTop=$(window).scrollTop();
    checkSimpleNavigation(currentTop);
    previousTop=currentTop;
    scrolling=false;
  }
  function checkSimpleNavigation(currentTop)
  { if(previousTop-currentTop>scrollDelta)
    mainHeader.removeClass('is-hidden');
    else if(currentTop-previousTop>scrollDelta && currentTop>scrollOffset)
    mainHeader.addClass('is-hidden');
  }
  window.addEventListener("scroll",hscroll,{passive:true});
}

function shave(selector)
{ const character='…';
  const classname='js-shave';
  const spaces = true;
  const charHtml = `<span class="js-shave-char">${character}</span>`;
  $.each($(selector),function(i,el)
  { if(el.querySelector(`.${classname}`))
    return;
    const maxHeight=$(el).parent().height();
    if(el.offsetHeight<maxHeight) return;
    const fullText = el.textContent;
    const words = spaces?fullText.split(' '):fullText;
    if(words.length<2) return;
    let max = words.length;
    let min = 0;
    let pivot;
    while(min<max)
    { pivot=(min+max+1) >> 1;
      el.textContent=spaces?words.slice(0,pivot).join(' '):words.slice(0,pivot);
      el.insertAdjacentHTML('beforeend',charHtml);
      if(el.offsetHeight>maxHeight) max=spaces?pivot-1:pivot-2;
      else min=pivot;
    }
    if(max==words.length)
    { el.removeChild(el.querySelector('.js-shave-char'));
      return;
    }
    el.textContent=spaces?words.slice(0,max).join(' '):words.slice(0,max);
    el.insertAdjacentHTML('beforeend',charHtml);
  });
}

window.$.fn.shave = function shavePlugin()
{ shave(this);
  return this;
}

var _categorypage=false;
function getcategorypage(idcat)
{ if(_categorypage)
  return false;
  _categorypage=true;
  var url=$('#filtersform').attr('action')+'?idcat='+idcat+'&idtg='+idtg;
  var loadingtimer=setTimeout(function(){ loader_on(); }, 1000);
  $.post(url,{ ajax:'category' }, function(response)
  { _categorypage=false;
    if(typeof loadingtimer != 'undefined')
    { clearTimeout(loadingtimer);
      loader_off();
    }
    if(response)
    { $("#mainbox").html(response);
      initpage(true);
    }
  });
  return false;
}

var _favoritespage=false;
function getfavoritespage()
{ if(_favoritespage)
  return false;
  _favoritespage=true;
  var url='?filter=1&favs=1&idtg='+idtg;
  var loadingtimer=setTimeout(function(){ loader_on(); }, 1000);
  $.post(url,{ ajax:'filters' }, function(response)
  { _favoritespage=false;
    if(typeof loadingtimer != 'undefined')
    { clearTimeout(loadingtimer);
      loader_off();
    }
    if(response)
    { $("#mainbox").html(response);
      initpage(true);
    }
  });
  return false;
}

var _discountspage=false;
function getdiscountspage()
{ if(_discountspage)
  return false;
  _discountspage=true;
  var url='?filter=1&disc=1&idtg='+idtg;
  var loadingtimer=setTimeout(function(){ loader_on(); }, 1000);
  $.post(url,{ ajax:'filters' }, function(response)
  { _discountspage=false;
    if(typeof loadingtimer != 'undefined')
    { clearTimeout(loadingtimer);
      loader_off();
    }
    if(response)
    { $("#mainbox").html(response);
      initpage(true);
    }
  });
  return false;
}

var _filterspage=false;
function getfilterspage()
{ if(_filterspage)
  return false;
  _filterspage=true;
  if($("button.search__btn").hasClass('active'))
  $('button.search__btn').trigger('click');
  $('#filtersform input[name=filter]').val(1);
  var url='?'+$('#filtersform').serialize().replace(/[^&]+=&/g,'').replace(/&[^&]+=$/g,'').replace(/&(page|idex)=[0-9]*/g,'');
  var loadingtimer=setTimeout(function(){ loader_on(); }, 1000);
  $.post(url,{ ajax:'filters' }, function(response)
  { _filterspage=false;
    if(typeof loadingtimer != 'undefined')
    { clearTimeout(loadingtimer);
      loader_off();
    }
    if(response)
    { $("#mainbox").html(response);
      $("#filtersform input[name=filter]").val(2);
      tgapp.BackButton.show();
      initpage(true);
    }
  });
  return false;
}

function filterbytag(tag)
{ if(_filterspage)
  return false;
  _filterspage=true;
  var url='?filter=1&tags[]='+encodeURIComponent(tag)+'&idtg='+idtg;
  var loadingtimer=setTimeout(function(){ loader_on(); }, 1000);
  $.post(url,{ ajax:'filters' }, function(response)
  { _filterspage=false;
    if(typeof loadingtimer != 'undefined')
    { clearTimeout(loadingtimer);
      loader_off();
    }
    if(response)
    { $("#mainbox").html(response);
      $("#filtersform input[name=filter]").val(2);
      tgapp.BackButton.show();
      initpage(true);
    }
  });
  return false;
}

function getprofilepage(id)
{
  popupwin.load('?idtg='+idtg,{ajax:'profile'});
}

function getofferpage(id)
{
  popupwin.load('?idoffer='+id+'&idtg='+idtg,{ajax:'offer'});
}

function getbasketpage()
{
  popupwin.load('?idtg='+idtg,{ajax:'basket'});
}

function getinfopage()
{
  popupwin.load('?idtg='+idtg,{ajax:'info'});
}

var _sendorder=true;
function sendorder()
{
  if(_setbasket || _addrinfo)
  return;
  if(!_sendorder && !dlvinfo())
  return;
  $('input:focus,textarea:focus').trigger('blur');
  if(tgapp.initDataUnsafe.user.allows_write_to_pm)
  $('#orderform').trigger('submit');
  else
  { _appalert=true;
    tgapp.requestWriteAccess(function(res)
    { _appalert=false;
      if(res)
      $('#orderform').trigger('submit');
    });
  }
}

function preorder()
{
  if(!idtg)
  return;
  if($('#pcode').length>0 && $('#pcode').val().length>0)
  $('#pcodeform').trigger('submit');
  else
  { let call=0;
    $.each($('#basketbox input[type=number]'),function(i,item){ call+=parseFloat(item.value); });
    $('#ordercount').html(Math.round(call*100)/100);
    $('#ordersum').html($('#totalsum').html());
    $('#basketbox').hide();
    $('#orderbox').show();
    $('.site-footer').hide();
    $('.product__title').html('Новый заказ');
    $('#popupbox select[name=dlv]').trigger('change');
    $('#popupbox').scrollTop(0);
    $('#popupbox textarea[name=note]').focus(function()
    { setTimeout(function(){$('#popupbox').scrollTop($('#popupbox')[0].scrollHeight);},1000)
    });
    tgapp.MainButton.show();
    if(tgapp.SecondaryButton.isVisible)
    tgapp.SecondaryButton.hide();
  }
}

function backbasket()
{
  $('#basketbox').show();
  $('#orderbox').hide();
  $('#dlvinfo').hide();
  $('.site-footer').show();
  $('.product__title').html('Корзина');
  $('#popupbox').scrollTop(0);
  if(tgapp.MainButton.isVisible)
  tgapp.MainButton.hide();
  if(!$('.site-footer').length && tgapp.SecondaryButton.text!='КОРЗИНА')
  tgapp.SecondaryButton.show();
}

var _bc=-1;
function button_basket(bc,tobs)
{
  if(!idtg)
  return;
  if(bc>0)
  { bc=Math.round(bc*100)/100;
    if($('.site-footer').length>0)
    { $('#cartbtn span').html('Корзина ('+bc+')');
      $('#cartbtn img').attr('src','//t.ibot.by/app/images/icons/cart-f.svg');
      if(bc>_bc && _bc>=0 && !$('#cartbtn img').hasClass('dance'))
      { setTimeout(function(){ $('#cartbtn img').addClass('dance'); },1);
        setTimeout(function(){ $('#cartbtn img').removeClass('dance'); },3000);
      }
    }
    else
    { tgapp.SecondaryButton.text='KОРЗИНА ('+bc+')';
      tgapp.SecondaryButton.text='КОРЗИНА ('+bc+')';
      if(!tobs && !tgapp.MainButton.isVisible)
      tgapp.SecondaryButton.show();
    }
    if(tobs>0)
    getbasketpage();
  }
  else
  { if($('.site-footer').length>0)
    { $('#cartbtn span').html('Корзина');
      $('#cartbtn img').attr('src','//t.ibot.by/app/images/icons/cart.svg');
      $('#cartbtn img').removeClass('dance');
    }
    else
    { tgapp.SecondaryButton.text='КОРЗИНА';
      tgapp.SecondaryButton.hide();
    }
  }
  _bc=bc;
}

var _fc=-1;
function button_favs(fc)
{
  if(!idtg)
  return;
  if(!$('.site-footer').length)
  return;
  if(fc>0)
  { fc=Math.round(fc);
    $('#favsbtn span').html('Избранное ('+fc+')');
    $('#favsbtn img').attr('src','//t.ibot.by/app/images/icons/heart-f.svg');
    if(fc>_fc && _fc>=0 && !$('#favsbtn img').hasClass('dance'))
    { setTimeout(function(){ $('#favsbtn img').addClass('dance'); },1);
      setTimeout(function(){ $('#favsbtn img').removeClass('dance'); },3000);
    }
  }
  else
  { $('#favsbtn span').html('Избранное');
    $('#favsbtn img').attr('src','//t.ibot.by/app/images/icons/heart.svg');
    $('#favsbtn img').removeClass('dance');
  }
  _fc=fc;
}

var _favorite=false;
function favorite(ctx,idoff)
{
  let st=$(ctx).hasClass('infav')?0:1;
  if(_favorite || !idtg)
  return false;
  _favorite=true;
  $.post('',{action:'favorite',idtg:idtg,idoff:idoff,st:st,initdata:initdata},function(response)
  { _favorite=false;
    if(!response.length)
    return;
    let res = $.parseJSON(response);
    button_favs(res.favs);
    if(res.st>0)
    $(ctx).addClass('infav');
    else
    { $(ctx).removeClass('infav');
      if($('#filtersform input[name=favs]').val()>0)
      $('#offer'+idoff).remove();
    }
  });
}

var _share=false;
function share(idoff)
{
  if(_share || !idtg)
  return false;
  _share=true;
  $.post('',{action:'share',idtg:idtg,idoff:idoff,initdata:initdata},function(response)
  { _share=false;
    if(!response.length)
    return;
    tgapp.shareMessage(response);
  });
}

var _addbasket=false;
function addbasket(ctx,idoff)
{
  let idopt=idoff>0&&$('#idopt').length>0?$('#idopt').val():0;
  if(idoff>0)
  { $(ctx).removeClass('bszoom');
    setTimeout(function(){ $(ctx).addClass('bszoom'); },1);
  }
  if(idopt<0)
  { appalert('Нет в наличии.');
    return;
  }
  if(_addbasket || !idtg)
  return false;
  _addbasket=true;
  $.post('',{action:'addbasket',idtg:idtg,idoff:idoff,idopt:idopt,initdata:initdata},function(response)
  { _addbasket=false;
    if(!response.length)
    return;
    let res = $.parseJSON(response);
    if(res.all>0 && idoff>0)
    { $(ctx).addClass('inbasket');
      $('#buy'+idoff).addClass('inbasket');
    }
    if(res.all>=0)
    { button_basket(res.all,res.tobs);
      button_favs(res.favs);
    }
    else if(res.all==-1)
    appalert('Слишком много товаров в корзине.');
    else if(res.all==-2)
    appalert('Больше нет в наличии.');
    else
    $('body').remove();
  });
}

function dlvopts(sum)
{
  let currency = $('#currency').html();
  $.each($('#popupbox select[name=dlv]').find('option'),function(i,el)
  { let name=$(el).attr('dlv_name');
    let price=$(el).attr('dlv_price');
    let dfree=$(el).attr('dlv_dfree');
    let dprice=0;
    if(price>0)
    { if(dfree>0 && sum>=dfree)
      name+=' (бесплатно)';
      else
      { name+=' ('+modcents(price)+' '+currency+')';
        dprice=price;
      }
    }
    $(el).html(name);
  });
}

function dlvinfo()
{
  if($('#orderbox').is(':hidden'))
  return true;
  let dprice=0;
  let currency = $('#currency').html();
  let $dlv=$('#popupbox select[name=dlv]');
  let geo=$dlv.find('option:selected').attr('dlv_geo');
  let cdek=$dlv.find('option:selected').attr('dlv_cdek');
  let price=$dlv.find('option:selected').attr('dlv_price');
  let dfree=$dlv.find('option:selected').attr('dlv_dfree');
  let sum=Math.round($('#totalsum').html().replace(' ','')*100)/100;
  if(cdek>0)
  return !cdekinfo();
  if(geo>0)
  return !addrinfo($('#addr')[0]);
  if(price>0)
  { if(dfree>0 && sum>=dfree)
    dprice=-1;
    else
    dprice=price;
  }
  if(dprice>0)
  $('#dlvinfo').html('<p>Доставка '+modcents(dprice)+' '+currency+'</p>').show().find('p').addClass('bszoom');
  else if(dprice<0)
  $('#dlvinfo').html('<p>Доставка бесплатно</p>').show().find('p').addClass('bszoom');
  else
  $('#dlvinfo').html('').hide();
  _sendorder=true;
  return true;
}

var _setbasket=false;
function setbasket(idoff,idopt,val)
{
  if(!idtg)
  return false;
  val=Math.round(val.toString().replace(/[^0-9.,]+/,'').replace(',','.')*100)/100;
  if(val>0)
  $('#item_'+idoff+'_'+idopt).find('input[type=number]').val(val);
  else if(idoff>0)
  { $('#item_'+idoff+'_'+idopt).remove();
    $('#buy'+idoff).removeClass('inbasket');
  }
  _setbasket=true;
  $.post('',{action:'setbasket',idtg:idtg,idoff:idoff,idopt:idopt,count:val,initdata:initdata},function(response)
  { _setbasket=false;
    if(!response.length)
    return;
    let res = $.parseJSON(response);
    let currency = $('#currency').html();
    $.each(res.items,function(i,item)
    { if(val>0 && item.bch==idoff+'_'+idopt)
      { if((val-item.count)>=1)
        appalert('Больше нет в наличии.');
        else if((val-item.count)<0)
        appalert('Меньше нельзя заказать.');
      }
      if(item.count>0)
      $('#item_'+item.bch).find('input[type=number]').val(item.count);
      else
      $('#item_'+item.bch).remove();
      if(item.fdis.length>0)
      $('#item_'+item.bch).find('.catalog-list__discount').html('<s>'+modcents(item.sprice)+' '+currency+'</s> [-'+item.fdis+']').show();
      else
      $('#item_'+item.bch).find('.catalog-list__discount').html('').hide();
      $('#item_'+item.bch).find('.catalog-list__price .price span').html(modcents(item.price));
    });
    $('#sourcesum').html(modcents(res.sum));
    $('#discountsum').html('-'+modcents(res.dsum));
    $('#totalsum').html(modcents(res.bsum));
    if(res.dsum>0)
    { $('#sourcesumbox').show();
      $('#discountsumbox').show();
    }
    else
    { $('#sourcesumbox').hide();
      $('#discountsumbox').hide();
    }
    if(res.fpc)
    $('#pcodeform').show();
    else
    $('#pcodeform').hide();
    dlvopts(res.bsum);
    button_basket(res.all,0);
    if(res.all==0)
    popupwin.hide();
  });
}

function delbasket(idoff,idopt)
{
  if(!idtg)
  return false;
  $('#item_'+idoff+'_'+idopt).remove();
  $('#buy'+idoff).removeClass('inbasket');
  _setbasket=true;
  $.post('',{action:'setbasket',idtg:idtg,idoff:idoff,idopt:idopt,count:0,initdata:initdata},function(response)
  { _setbasket=false;
    if(!response.length)
    return;
    let res = $.parseJSON(response);
    let currency = $('#currency').html();
    $.each(res.items,function(i,item)
    { if(item.count>0)
      $('#item_'+item.bch).find('input[type=number]').val(item.count);
      else
      $('#item_'+item.bch).remove();
      if(item.fdis.length>0)
      $('#item_'+item.bch).find('.catalog-list__discount').html('<s>'+modcents(item.sprice)+' '+currency+'</s> [-'+item.fdis+']').show();
      else
      $('#item_'+item.bch).find('.catalog-list__discount').html('').hide();
      $('#item_'+item.bch).find('.catalog-list__price .price span').html(modcents(item.price));
    });
    $('#sourcesum').html(modcents(res.sum));
    $('#discountsum').html('-'+modcents(res.dsum));
    $('#totalsum').html(modcents(res.bsum));
    if(res.dsum>0)
    { $('#sourcesumbox').show();
      $('#discountsumbox').show();
    }
    else
    { $('#sourcesumbox').hide();
      $('#discountsumbox').hide();
    }
    dlvopts(res.bsum);
    button_basket(res.all,0);
    if(res.all==0)
    popupwin.hide();
  });
}

function cinc(ctx)
{
  if(!_setbasket)
  { _setbasket=true;
    $(ctx).parent().find('input').val(function(i,val)
    { val=parseFloat(val)+parseFloat($(this).attr('step'));
      return Math.round(val*100)/100;
    }).trigger('change');
  }
}

function cdec(ctx)
{
  if(!_setbasket)
  { _setbasket=true;
    $(ctx).parent().find('input').val(function(i,val)
    { val=parseFloat(val)-parseFloat($(this).attr('step'));
      return Math.round(val*100)/100;
    }).trigger('change');
  }
}

var _offerspage=false;
function getofferspage(page)
{ if(_offerspage)
  return false;
  _offerspage=true;
  $('#filtersform input[name=page]').val(page);
  var url=$('#filtersform').attr('action')+'?'+$('#filtersform').serialize().replace(/[^&]+=&/g,'').replace(/&[^&]+=$/g,'');
  $('#nextbtn').html('<img width="16" height="16" src="//t.ibot.by/app/images/loader.gif">');
  $.post(url,{ ajax:'offers' }, function(response)
  { if(response)
    $("#morebox"+page).html(response).find('.catalog-node__title span').shave();
    else
    { $("#morebox"+page).remove();
      $("h3.moremodels").remove();
    }
    _offerspage=false;
  });
  return false;
}

function selopt()
{
  let opt='',
  opt1=$('select#opt1').length>0?$('#opt1').val():$('#opt1 input[type=radio]:checked').val(),
  opt2=$('select#opt2').length>0?$('#opt2').val():$('#opt2 input[type=radio]:checked').val(),
  opt3=$('select#opt3').length>0?$('#opt3').val():$('#opt3 input[type=radio]:checked').val(),
  opt4=$('select#opt4').length>0?$('#opt4').val():$('#opt4 input[type=radio]:checked').val(),
  opt5=$('select#opt5').length>0?$('#opt5').val():$('#opt5 input[type=radio]:checked').val();
  if(opt1!=undefined)
  opt+=opt1;
  if(opt2!=undefined)
  opt+=' + '+opt2;
  if(opt3!=undefined)
  opt+=' + '+opt3;
  if(opt4!=undefined)
  opt+=' + '+opt4;
  if(opt5!=undefined)
  opt+=' + '+opt5;
  $('#idopt').val(-1);
  $.each($('input.optitems'),function(i,el)
  { if($(el).val()==opt && $(el).attr('data-price')>0)
    { $('#idopt').val(i+1);
      $('#pricebox').html(modcents($(el).attr('data-price'))).parent().show();
      $('#oldpricebox').html(modcents($(el).attr('data-sprice'))+' '+$('#currency').val());
      let amt=$(el).attr('data-amt');
      if(amt.length==0)
      { $('#amtbox b').html($('#amtbox').hasClass('favoff')?'':'Избранное');
        $('#tobasketbtn').show();
      }
      else if(amt>0)
      { if($('#amtbox').attr('data-amthide')>0)
        $('#amtbox b').html('В наличии');
        else
        $('#amtbox b').html('В наличии ('+amt+')');
        $('#tobasketbtn').show();
      }
      else
      { $('#amtbox b').html('Нет в наличии');
        $('#tobasketbtn').hide();
      }
      return false;
    }
  });
  if($('#idopt').val()<0)
  { $('#pricebox').html('').parent().hide();
    $('#oldpricebox').html('');
    $('#amtbox b').html('Нет в наличии');
    $('#tobasketbtn').hide();
  }
}

var _addrinfo=false;
function addrinfo(ctx)
{
  if($(ctx).is(":focus"))
  $(ctx).trigger('blur').focus();
  if(_addrinfo || $(ctx.form.dlv).find('option:selected').attr('dlv_geo')==0)
  return false;
  else if(!ctx.value.length && !ctx.form.geopoint.value.length)
  { $('#dlvinfo').html('').hide();
    return false;
  }
  _addrinfo=true;
  let idd=ctx.form.dlv.value,addr=ctx.value,point=ctx.form.geopoint.value;
  let idc=$('#orderform input[name=idc]').val();
  $.post('',{action:'addrinfo',idd:idd,idc:idc,addr:addr,point:point,initdata:initdata},function(response)
  { _addrinfo=false;
    _sendorder=true;
    if(response.length>0)
    $('#dlvinfo').html('<p>'+response+'</p>').show().find('p').addClass('bszoom');
    else
    $('#dlvinfo').html('').hide();
  });
  return _addrinfo;
}

var _cdekinfo=false;
function cdekinfo()
{
  let idd=$('#orderform select[name=dlv]').val();
  let idc=$('#orderform input[name=idc]').val(),to=$('#cdek_code').val(),tariff=$('#cdek_tariff').val();
  if(_cdekinfo || idd==0 || idc==0 || to==0 || tariff==0)
  { $('#dlvinfo').html('').hide();
    return false;
  }
  _cdekinfo=true;
  $.post('',{action:'cdekinfo',idd:idd,idc:idc,to:to,tariff:tariff,initdata:initdata},function(response)
  { _cdekinfo=false;
    _sendorder=true;
    if(response.length>0)
    $('#dlvinfo').html('<p>'+response+'</p>').show().find('p').addClass('bszoom');
    else
    $('#dlvinfo').html('').hide();
  });
  return _cdekinfo;
}

function scrollBottom()
{
  setTimeout(function(){$('#popupbox').scrollTop($('#popupbox')[0].scrollHeight);},1000);
}

function seldlv(ctx,useaddr,usegeo)
{
  if($.inArray(ctx.value,useaddr.split(','))>=0)
  { $('#addrbox').show();
    let auto=$(ctx).find('option:selected').attr('dlv_auto');
    let full=$(ctx).find('option:selected').attr('dlv_full');
    let country=$(ctx).find('option:selected').attr('dlv_country');
    let city=$(ctx).find('option:selected').attr('dlv_city');
    $('#addr').unbind().focus(scrollBottom);
    if(auto>0)
    { $('#addr').suggest('/addrs.php?country='+encodeURIComponent(country)+'&city='+encodeURIComponent(city)+'&full='+full);
      $('#addr').change(function(){ _sendorder=false; });
    }
    if($.inArray(ctx.value,usegeo.split(','))>=0)
    $('#geobtn').show();
    else
    $('#geobtn').hide();
  }
  else
  { $('#addrbox').hide();
    $('#geobtn').hide();
  }
  if($(ctx).find('option:selected').attr('dlv_cdek')>0)
  { $('#cdekbox').show();
    $('#cdek').unbind().focus(scrollBottom).blur(function() {this.value='';} );
    $('#cdek').cdek('/cdek.php');
  }
  else
  { $('#cdek').val('');
    $('#cdekbox').hide();
  }
  $.each($(ctx).find('option'),function(i,el)
  { if(ctx.value==el.value)
    $('#fbox'+el.value).show();
    else
    $('#fbox'+el.value).hide();
  });
  dlvinfo();
}

function selpay(ctx,usemail)
{
  if($.inArray(ctx.value,usemail.split(','))>=0)
  $('#mailbox').show();
  else
  $('#mailbox').hide();
}

function orderfine()
{
  popupwin.hide();
  tgapp.close();
}

function getrealphone(ctx)
{
  let frp=$(ctx).prop('readonly');
  if(ctx.value.length>0 && frp && $(ctx).attr('data-real')==1)
  { appalert('Номер телефона подтвержден.');
    $(ctx).blur();
    return;
  }
  else if(ctx.value.length>0 && !frp)
  return;
  _appalert=true;
  tgapp.requestContact(function(res)
  { _appalert=false;
    if(res)
    { setTimeout(function()
      { $.post('',{action:'rphone',idc:ctx.form.idc.value,initdata:initdata},function(response)
        { if(response.length)
          { ctx.value=response;
            if(ctx.form.id=='orderform')
            $(ctx).prop('readonly',false);
            $(ctx).attr('data-real',1).blur();
          }
        });
      },1000);
    }
    else if(frp)
    $(ctx).blur();
  });
}

function _geoLocation()
{
  if(!tgapp.LocationManager.isLocationAvailable)
  appalert('Нельзя определить местоположение.');
  else if(tgapp.LocationManager.isAccessRequested && !tgapp.LocationManager.isAccessGranted)
  tgapp.showConfirm('Включите разрешение доступа к геопозиции.',function(res){ if(res) tgapp.LocationManager.openSettings(); });
  else
  tgapp.LocationManager.getLocation(function(loc)
  { if(loc==null)
    appalert('Местоположение не определено.');
    else if(loc.latitude>0 && loc.longitude>0)
    { let lat=loc.latitude.toFixed(6),lon=loc.longitude.toFixed(6);
      $('#geobtn').html('<span></span> '+lat+','+lon);
      $('#addr')[0].form.geopoint.value=lat+','+lon;
      dlvinfo();
    }
    else
    appalert('Местоположение не определено.');
  });
}

function geoLocation()
{
  if(!tgapp.LocationManager.isInited)
  tgapp.LocationManager.init(_geoLocation);
  else
  _geoLocation();
}

var wcdek = [];
function cdekLocation()
{
  let $dlv=$('#orderform select[name=dlv]').find('option:selected');
  let idd=$dlv.attr('value'),fromcode=$dlv.attr('dlv_cdek');
  if(fromcode==0)
  return;
  else if(idd in wcdek)
  { wcdek[idd].open();
    if($('#cdek_point').val().length>0)
    wcdek[idd].selectOffice($('#cdek_point').val());
    return;
  }
  let idc=$('#orderform input[name=idc]').val();
  let currency = $('#currency').html();
  let defloc=$('#orderform input[name=defloc]').val();
  if(defloc.length>0)
  defloc=defloc.split(',');
  else
  defloc=$dlv.attr('dlv_city');
  $.when(
  $.getScript("https://cdn.jsdelivr.net/npm/@cdek-it/widget@3"),
  $.getScript("https://cdn.jsdelivr.net/npm/@unocss/runtime"),
  $.Deferred(function(deferred){ $( deferred.resolve ); })).done(function()
  { wcdek[idd] = new window.CDEKWidget({
    from: { code:fromcode },
    root: 'cdek-map',
    apiKey: '9a1e8159-1eeb-447f-a738-26bbc8bb10e0',
    canChoose: true,
    servicePath: '/cdek.php?idc='+idc+'&idd='+idd,
    hideFilters: { have_cashless:true,have_cash:true,is_dressing_room:true,type:true },
    hideDeliveryOptions: { office:false,door:true },
    popup: true,
    debug: false,
    goods: [{ width:10,height:10,length:10,weight:10 }],
    defaultLocation: defloc,
    lang: 'rus',
    currency: currency,
    tariffs: { door:[],office:[136],pickup:[136] },
    onReady()
    { if($('#cdek_point').val().length>0)
      wcdek[idd].selectOffice($('#cdek_point').val());
    },
    onChoose(m,t,p)
    { let addr=p.city+', '+p.address;
      if(p.country_code=='RU')
      addr='Россия, '+p.city+', '+p.address;
      else if(p.country_code=='BY')
      addr='Беларусь, '+p.city+', '+p.address;
      $('#cdek_btn').html(addr);
      $('#cdek_addr').val(addr);
      $('#cdek_code').val(p.city_code);
      $('#cdek_point').val(p.code);
      $('#cdek_tariff').val(t.tariff_code);
      if(t.delivery_sum>0)
      $('#dlvinfo').html('<p>Доставка '+modcents(t.delivery_sum)+' '+currency+'</p>').show().find('p').addClass('bszoom');
      else
      $('#dlvinfo').html('<p>Доставка бесплатно</p>').show().find('p').addClass('bszoom');
      wcdek[idd].close();
    }});
    wcdek[idd].open();
  });
}

function initpage(pw)
{
  if(pw)
  { $('#popupbox').removeClass('opened').html('');
    $("html,body").removeClass('overflow-hidden').animate({scrollTop:0},0);
  }

  activateScrollHeader();
  $("input[name=idtg]").val(idtg);
  $("input[name=initdata]").val(initdata);
  $("#mainbox .catalog-node__title span").shave();

  $("button.search__btn").click(function()
  { if($(this).hasClass('active'))
    { $(this).removeClass('active');
      $(".search__layout").removeClass('visible');
      $(".search__filters").removeClass('visible');
      $("body").removeClass('overflow-hidden');
      if($(window).scrollTop()<30)
      $('html,body').animate({scrollTop:0},0);
    }
    else
    { $(this).addClass('active');
      $(".search__layout").addClass('visible');
      $(".search__filters").addClass('visible').animate({scrollTop:0},0);
      $("body").addClass('overflow-hidden');
      if($(window).height()==$('body').height())
      $('body').height($('body').height()+20);
      if($(window).scrollTop()<20)
      $('html,body').animate({scrollTop:'20px'},0);
    }
  });

  $('#filtersform').on('click','.manufacturer .view-more',function()
  { $(".manufacturer__inner").toggleClass('has-hidden');
    $(this).toggleClass('opened');
    if($(this).hasClass('opened'))
    { $('#tags_box label').sort(function(a,b)
      { var an = $(a).text(),bn = $(b).text();
        if(an && bn) { return an.toLowerCase().localeCompare(bn.toLowerCase(),'en-EN'); }
        return 0;
      }).detach().appendTo($('#tags_box'));;
      $(this).html('Скрыть');
    }
    else
    { $('#tags_box label').sort(function(a,b)
      { var an = $(a).text(),bn = $(b).text();
        var ad = $(a).find('input').is(':disabled'),bd = $(b).find('input').is(':disabled');
        var ac = $(a).find('input').is(':checked'),bc = $(b).find('input').is(':checked');
        var aw=parseInt($(a).attr('data-weight')),bw=parseInt($(b).attr('data-weight'));
        if(ad!=bd) { return ad>bd?1:-1; }
        if(ac!=bc) { return ac<bc?1:-1; }
        if(aw!=bw) { return aw<bw?1:-1; }
        if(an && bn) { return an.toLowerCase().localeCompare(bn.toLowerCase(),'en-EN'); }
        return 0;
      }).detach().appendTo($('#tags_box'));
      $(this).html('Показать все ('+$('#tags_box label').length+')');
    }
    return false;
  });

  function wscroll()
  { let windowHeight=$(window).height(),btn=$('#nextbtn');
    if(btn.length>0 && !$('body').hasClass('overflow-hidden'))
    { let top=btn.offset().top;
	  if(!_offerspage && $(document).scrollTop()+windowHeight*2>top)
      btn.trigger('click');
    }
  }
  if($('#nextbtn').length>0)
  { wscroll();
    window.addEventListener("scroll",wscroll,{passive:true});
  }
}

$(document).ready(function()
{
  if(!idtg && document.referrer!='https://ibot.by/')
  { $('body').remove();
    return;
  }

  initpage(false);
  addbasket();

  if(idtg && w18p)
  { if($.cookie('w18p')>0)
    $.cookie('w18p',1,{expires:30,path:'/'});
    else
    { $("body").hide();
      tgapp.showConfirm("Подтвердите, что вам уже есть 18 лет!",function(res)
      { if(res)
        { $("body").show();
          $.cookie('w18p',1,{expires:30,path:'/'});
        }
        else
        tgapp.close();
      });
    }
  }

  if($('#popupbox').html().length>10)
  popupwin.show();
  else if($.urlParam('idtg',0)>0)
  appalert('Корзина сейчас пуста.');
  else if($.urlParam('idoffer',0)>0)
  appalert('Товар сейчас недоступен.');

  if(idtg>0)
  tgapp.BackButton.onClick(function()
  { if(mySmartPhoto && !mySmartPhoto.data.hide)
    mySmartPhoto.hidePhoto();
    else if($("#orderbox:visible").length>0)
    backbasket();
    else if($("#popupbox").hasClass('opened'))
    $("#popupbox .close-popup").trigger('click');
    else if($("button.search__btn").hasClass('active'))
    $("button.search__btn").trigger('click');
    else if($("#filtersform input[name=filter]").val()==2)
    $('#navbtn').trigger('click');
    else if($('#navbtn').hasClass('back-nav__btn'))
    $('#navbtn').trigger('click');
    else
    tgapp.close();
  });

  tgapp.expand();
  tgapp.BackButton.show();
  tgapp.MainButton.onClick(sendorder);
  tgapp.MainButton.textColor="#ffffff";
  tgapp.MainButton.color=$('.submit-filters').css('background-color');
  tgapp.MainButton.text='СДЕЛАТЬ ЗАКАЗ';
  tgapp.SecondaryButton.onClick(getbasketpage);
  tgapp.SecondaryButton.textColor="#ffffff";
  tgapp.SecondaryButton.color="#4ea5cd";
  tgapp.SecondaryButton.text='КОРЗИНА';
  tgapp.ready();
});