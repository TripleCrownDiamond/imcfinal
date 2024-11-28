import{q as x,W as p,j as e}from"./app-CU81j7nS.js";import{T as l,I as n}from"./TextInput-CmnHJseN.js";import{I as i}from"./InputLabel-B1UNEY7t.js";import{P as j}from"./PrimaryButton-B91Wo0_j.js";import{z as v}from"./transition-CyRQxhFf.js";function y({status:f,className:o=""}){const s=x().props.auth.user,{data:t,setData:r,patch:u,errors:m,processing:d,recentlySuccessful:c}=p({first_name:s.first_name||"",last_name:s.last_name||"",username:s.username||"",email:s.email||"",phone_number:s.phone_number||"",address:s.address||"",birth_date:s.birth_date||""}),h=a=>{a.preventDefault(),u(route("profile.update"))};return e.jsxs("section",{className:o,children:[e.jsxs("header",{children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Informations du Profil"}),e.jsx("p",{className:"mt-1 text-sm text-gray-600",children:"Mettez à jour les informations de votre compte et votre adresse e-mail."})]}),e.jsxs("form",{onSubmit:h,className:"mt-6 space-y-6",children:[e.jsxs("div",{children:[e.jsx(i,{htmlFor:"first_name",value:"Prénom"}),e.jsx(l,{id:"first_name",className:"mt-1 block w-full",value:t.first_name,onChange:a=>r("first_name",a.target.value),required:!0,autoComplete:"first_name"}),e.jsx(n,{className:"mt-2",message:m.first_name})]}),e.jsxs("div",{children:[e.jsx(i,{htmlFor:"last_name",value:"Nom"}),e.jsx(l,{id:"last_name",className:"mt-1 block w-full",value:t.last_name,onChange:a=>r("last_name",a.target.value),required:!0,autoComplete:"last_name"}),e.jsx(n,{className:"mt-2",message:m.last_name})]}),e.jsxs("div",{children:[e.jsx(i,{htmlFor:"username",value:"Nom d'utilisateur"}),e.jsx(l,{id:"username",className:"mt-1 block w-full",value:t.username,onChange:a=>r("username",a.target.value),required:!0,autoComplete:"username"}),e.jsx(n,{className:"mt-2",message:m.username})]}),e.jsxs("div",{children:[e.jsx(i,{htmlFor:"email",value:"E-mail"}),e.jsx(l,{id:"email",type:"email",className:"mt-1 block w-full",value:t.email,onChange:a=>r("email",a.target.value),required:!0,autoComplete:"email"}),e.jsx(n,{className:"mt-2",message:m.email})]}),e.jsxs("div",{children:[e.jsx(i,{htmlFor:"phone_number",value:"Numéro de téléphone"}),e.jsx(l,{id:"phone_number",className:"mt-1 block w-full",value:t.phone_number,onChange:a=>r("phone_number",a.target.value),autoComplete:"phone_number"}),e.jsx(n,{className:"mt-2",message:m.phone_number})]}),e.jsxs("div",{children:[e.jsx(i,{htmlFor:"address",value:"Adresse"}),e.jsx(l,{id:"address",className:"mt-1 block w-full",value:t.address,onChange:a=>r("address",a.target.value)}),e.jsx(n,{className:"mt-2",message:m.address})]}),e.jsxs("div",{children:[e.jsx(i,{htmlFor:"birth_date",value:"Date de naissance"}),e.jsx(l,{id:"birth_date",type:"date",className:"mt-1 block w-full",value:t.birth_date,onChange:a=>r("birth_date",a.target.value)}),e.jsx(n,{className:"mt-2",message:m.birth_date})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(j,{disabled:d,children:"Enregistrer"}),e.jsx(v,{show:c,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:e.jsx("p",{className:"text-sm text-gray-600",children:"Enregistré."})})]})]})]})}export{y as default};
