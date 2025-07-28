"use strict";(()=>{var e={};e.id=3893,e.ids=[3893],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},5184:e=>{e.exports=require("nodemailer")},7210:(e,o,a)=>{a.r(o),a.d(o,{config:()=>c,default:()=>l,routeModule:()=>g});var i={};a.r(i),a.d(i,{default:()=>handler});var r=a(1802),s=a(7153),n=a(6249),t=a(5184),d=a.n(t);let p=d().createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT),secure:!1,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});async function sendEmail(e,o,a){try{await p.sendMail({from:'"MicroJobs" <no-reply@microjobs.pl>',to:e,subject:o,html:a})}catch(e){throw console.error("Błąd wysyłania emaila:",e),e}}async function handler(e,o){if("POST"!==e.method)return o.status(405).json({message:"Method not allowed"});try{let{title:a,category:i,contactEmail:r,price:s}=e.body,n=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Nowe ogłoszenie na MicroJobs</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Szczeg\xf3ły ogłoszenia:</h3>
          <p><strong>Tytuł:</strong> ${a}</p>
          <p><strong>Kategoria:</strong> ${i}</p>
          <p><strong>Cena:</strong> ${s} zł</p>
          <p><strong>Email kontaktowy:</strong> ${r}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e;">
            <strong>Wymagane działanie:</strong> Sprawdź ogłoszenie pod kątem zgodności z regulaminem i potwierdź publikację.
          </p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            To powiadomienie zostało wysłane automatycznie z systemu MicroJobs.
          </p>
        </div>
      </div>
    `;await sendEmail("unlimitedcontentg@gmail.com","Nowe ogłoszenie wymaga weryfikacji - MicroJobs",n),o.status(200).json({message:"Powiadomienie wysłane pomyślnie"})}catch(e){console.error("Błąd wysyłania powiadomienia:",e),o.status(500).json({message:"Błąd serwera"})}}let l=(0,n.l)(i,"default"),c=(0,n.l)(i,"config"),g=new r.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/notifications/new-offer",pathname:"/api/notifications/new-offer",bundlePath:"",filename:""},userland:i})}};var o=require("../../../webpack-api-runtime.js");o.C(e);var __webpack_exec__=e=>o(o.s=e),a=o.X(0,[4222],()=>__webpack_exec__(7210));module.exports=a})();