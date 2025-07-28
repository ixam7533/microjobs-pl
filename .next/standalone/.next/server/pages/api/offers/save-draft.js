"use strict";(()=>{var e={};e.id=8246,e.ids=[8246],e.modules={3524:e=>{e.exports=require("@prisma/client")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},8516:(e,o,t)=>{t.r(o),t.d(o,{config:()=>c,default:()=>p,routeModule:()=>g});var a={};t.r(a),t.d(a,{default:()=>handler});var r=t(1802),n=t(7153),s=t(6249),i=t(3524);let d=new i.PrismaClient;async function handler(e,o){if("POST"!==e.method)return o.status(405).json({error:"Method not allowed"});try{let{offerType:t,title:a,description:r,price:n,category:s,subcategories:i,location:p,contactName:c,contactEmail:g,contactPhone:l,wantPromo:u,userEmail:f,paymentType:m,userId:w}=e.body,h=await d.offer.create({data:{offerType:t,title:a,description:r,price:parseFloat(n)||0,category:s,location:p,contactName:c,contactEmail:g,contactPhone:l||"",ownerId:w||1,autorenew:!1,promoted:!1}}),z={to:"admin@microjobs.pl",subject:`Nowy draft ogłoszenia - ${a}`,html:`
        <h2>Nowe ogłoszenie czeka na opłacenie</h2>
        <p><strong>ID:</strong> ${h.id}</p>
        <p><strong>Tytuł:</strong> ${a}</p>
        <p><strong>Email użytkownika:</strong> ${f}</p>
        <p><strong>Email kontaktowy:</strong> ${g}</p>
        <p><strong>Typ płatności:</strong> ${m}</p>
        <p><strong>Cena ogłoszenia:</strong> ${n} zł</p>
        <p><strong>Promocja:</strong> ${u?"TAK":"NIE"}</p>
        <p><strong>Podkategorie:</strong> ${JSON.stringify(i)}</p>
        
        <h3>Akcje:</h3>
        <p>Po otrzymaniu płatności Shopify, ręcznie zmień status ogłoszenia:</p>
        
        <h3>SQL do aktywacji zwykłego ogłoszenia:</h3>
        <code>
        UPDATE "Offer" SET promoted = false WHERE id = ${h.id};
        </code>
        
        <h3>SQL do aktywacji z promocją:</h3>
        <code>
        UPDATE "Offer" SET promoted = true, promotedUntil = datetime('now', '+7 days') WHERE id = ${h.id};
        </code>
      `};console.log("Admin notification:",z),o.status(200).json({success:!0,draftId:h.id,message:"Ogłoszenie zapisane jako draft. Po opłaceniu zostanie opublikowane."})}catch(e){console.error("Error saving draft:",e),o.status(500).json({error:"Błąd zapisywania ogłoszenia"})}}let p=(0,s.l)(a,"default"),c=(0,s.l)(a,"config"),g=new r.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/offers/save-draft",pathname:"/api/offers/save-draft",bundlePath:"",filename:""},userland:a})}};var o=require("../../../webpack-api-runtime.js");o.C(e);var __webpack_exec__=e=>o(o.s=e),t=o.X(0,[4222],()=>__webpack_exec__(8516));module.exports=t})();