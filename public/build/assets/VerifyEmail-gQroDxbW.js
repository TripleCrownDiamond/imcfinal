import{W as r,j as e,Y as a,a as d}from"./app-CU81j7nS.js";import{P as l}from"./PrimaryButton-B91Wo0_j.js";import{G as m}from"./GuestLayout-vq8oWw2g.js";import"./ApplicationLogo-CKQckDiy.js";import"./index-CRzonMBn.js";function h({status:t}){const{post:i,processing:s}=r({}),o=n=>{n.preventDefault(),i(route("verification.send"))};return e.jsxs(m,{children:[e.jsx(a,{title:"Email Verification"}),e.jsx("div",{className:"mb-4 text-sm text-gray-600",children:"Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another."}),t==="verification-link-sent"&&e.jsx("div",{className:"mb-4 text-sm font-medium text-green-600",children:"A new verification link has been sent to the email address you provided during registration."}),e.jsx("form",{onSubmit:o,children:e.jsxs("div",{className:"mt-4 flex items-center justify-between",children:[e.jsx(l,{disabled:s,children:"Resend Verification Email"}),e.jsx(d,{href:route("logout"),method:"post",as:"button",className:"rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",children:"Log Out"})]})})]})}export{h as default};
