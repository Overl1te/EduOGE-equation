
"use client";
import React from "react";

function gcd(a,b){return b===0?a:gcd(b,a%b);}
function reduce(num,den){
  const g=gcd(num,den); num/=g; den/=g;
  if(den<0){num=-num;den=-den;}
  return den===1?String(num):num+"/"+den;
}
function rint(a,b){return Math.floor(Math.random()*(b-a+1))+a;}

export default function Page(){
  function generate(){
    const type=rint(1,6);
    let eq="", roots=[], sol="";

    if(type===1){
      let rn=rint(-10,10), rd=rint(1,10);
      const root=reduce(rn,rd);
      const a=rint(1,10);
      const b=reduce(-a*rn, rd);
      eq=`${a}x + ${b} = 0`;
      roots=[root];
      sol=`x = ${root}`;
    }

    if(type===2){
      const r1=rint(-10,10), r2=rint(-10,10);
      const b=-(r1+r2), c=r1*r2;
      eq=`x² ${b>=0?"+":""}${b}x ${c>=0?"+":""}${c} = 0`;
      roots=[r1,r2];
      sol=`Корни: ${r1}, ${r2}`;
    }

    if(type===3){
      const r1=rint(-5,5), r2=rint(-5,5), r3=rint(-5,5);
      const b=-(r1+r2+r3);
      const c=r1*r2+r1*r3+r2*r3;
      const d=-r1*r2*r3;
      eq=`x³ ${b>=0?"+":""}${b}x² ${c>=0?"+":""}${c}x ${d>=0?"+":""}${d} = 0`;
      roots=[r1,r2,r3];
      sol=`Корни: ${r1}, ${r2}, ${r3}`;
    }

    if(type===4){
      const r1=rint(1,10), r2=rint(1,10);
      const p=-(r1*r1+r2*r2);
      const q=r1*r1*r2*r2;
      eq=`x⁴ ${p>=0?"+":""}${p}x² ${q>=0?"+":""}${q} = 0`;
      roots=[r1,-r1,r2,-r2];
      sol=`Корни: ±${r1}, ±${r2}`;
    }

    if(type===5){
      let xN=rint(-10,10), xD=rint(1,10);
      let yN=rint(-10,10), yD=rint(1,10);
      const x0=reduce(xN,xD), y0=reduce(yN,yD);
      const a1=rint(1,10), b1=rint(1,10);
      const a2=rint(1,10), b2=rint(1,10);
      const c1 = `${reduce(a1*xN,xD)} + ${reduce(b1*yN,yD)}`;
      const c2 = `${reduce(a2*xN,xD)} + ${reduce(b2*yN,yD)}`;
      eq=`${a1}x + ${b1}y = (${c1});  ${a2}x + ${b2}y = (${c2})`;
      roots=[`x=${x0}`,`y=${y0}`];
      sol=`Решение: x=${x0}, y=${y0}`;
    }

    if(type===6){
      const a=rint(1,10);
      let n=rint(1,10), d=rint(1,10);
      const root=reduce(n,d);
      const b=reduce(a*d,n);
      eq=`${a}/x = ${b}`;
      roots=[root];
      sol=`x = ${root}`;
    }

    return {eq, roots, sol};
  }

  const [data,setData]=React.useState(generate());

  return (
    <div style={{padding:20}}>
      <h2>Генератор (JS)</h2>
      <button onClick={()=>setData(generate())}>Сгенерировать</button>
      <p><b>Уравнение:</b> {data.eq}</p>
      <p><b>Корни:</b> {JSON.stringify(data.roots)}</p>
      <p><b>Решение:</b> {data.sol}</p>
    </div>
  );
}
