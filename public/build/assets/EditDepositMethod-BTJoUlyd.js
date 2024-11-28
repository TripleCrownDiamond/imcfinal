import{q as g,W as f,r as b,j as e,Y as j,a as v}from"./app-CU81j7nS.js";import{A as y}from"./AuthenticatedLayout-dRBKfQCh.js";import{n as l}from"./index-CRzonMBn.js";import{P as N}from"./PrimaryButton-B91Wo0_j.js";import"./ApplicationLogo-CKQckDiy.js";import"./transition-CyRQxhFf.js";import"./SecondaryButton-BoGYldyN.js";function F({depositMethod:i}){const{flash:t}=g().props,{data:o,setData:n,put:u,processing:x,errors:d}=f({name:i.name||"",description:i.description||"",fields:i.fields.map(s=>({id:s.id,field_name:s.field_name,field_type:s.field_type,field_value:s.field_value}))});b.useEffect(()=>{t!=null&&t.success&&l.success(t.success),t!=null&&t.error&&l.error(t.error)},[t]);const p=s=>{s.preventDefault(),u(route("deposit-methods.update",i.id),{onSuccess:()=>l.success("Méthode mise à jour avec succès !"),onError:()=>l.error("Une erreur s'est produite lors de la mise à jour.")})},m=(s,r,a)=>{n("fields",o.fields.map((c,h)=>h===s?{...c,[r]:a}:c))};return e.jsxs(y,{header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Éditer Méthode de Dépôt"}),children:[e.jsx(j,{title:"Éditer Méthode de Dépôt"}),e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"max-w-4xl mx-auto sm:px-6 lg:px-8",children:e.jsx("div",{className:"bg-white overflow-hidden shadow-sm sm:rounded-lg",children:e.jsx("div",{className:"p-6 bg-white border-b border-gray-200",children:e.jsxs("form",{onSubmit:p,className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"name",className:"block text-sm font-medium text-gray-700",children:"Nom"}),e.jsx("input",{type:"text",id:"name",value:o.name,onChange:s=>n("name",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"}),d.name&&e.jsx("p",{className:"text-red-600 text-sm mt-1",children:d.name})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"description",className:"block text-sm font-medium text-gray-700",children:"Description"}),e.jsx("textarea",{id:"description",value:o.description,onChange:s=>n("description",s.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"}),d.description&&e.jsx("p",{className:"text-red-600 text-sm mt-1",children:d.description})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-700 mb-4",children:"Champs Associés"}),o.fields.map((s,r)=>e.jsxs("div",{className:"space-y-2 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Nom du Champ"}),e.jsx("input",{type:"text",value:s.field_name,onChange:a=>m(r,"field_name",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Type du Champ"}),e.jsx("input",{type:"text",value:s.field_type,onChange:a=>m(r,"field_type",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Valeur"}),e.jsx("input",{type:"text",value:s.field_value,onChange:a=>m(r,"field_value",a.target.value),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"})]}),d[`fields.${r}`]&&e.jsx("p",{className:"text-red-600 text-sm mt-1",children:d[`fields.${r}`]})]},s.id))]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx(v,{href:"/deposit-methods",className:"text-sm text-gray-500 underline hover:text-gray-700",children:"Annuler"}),e.jsx(N,{disabled:x,children:"Mettre à jour"})]})]})})})})})]})}export{F as default};
