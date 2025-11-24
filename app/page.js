
"use client";
import React from "react";

export default function Page() {
  function generate() {
    const type = Math.floor(Math.random() * 5) + 1;
    const rand = () => Math.floor(Math.random() * 21) - 10;

    let equation = "";
    let roots = [];
    let solution = "";

    if (type === 1) {
      // ax + b = 0
      const x = rand() || 1;
      const a = rand() || 1;
      const b = -a * x;
      equation = `${a}x + ${b} = 0`;
      roots = [x];
      solution = `Корень: x = -b/a = ${-b}/${a} = ${x}`;
    }

    if (type === 2) {
      // quadratic with known roots r1, r2
      const r1 = rand() || 1;
      const r2 = rand() || 2;
      const a = 1;
      const b = -(r1 + r2);
      const c = r1 * r2;
      equation = `x² ${b>=0?"+":""}${b}x ${c>=0?"+":""}${c} = 0`;
      roots = [r1, r2];
      solution = `Корни квадратного уравнения: ${r1}, ${r2}`;
    }

    if (type === 3) {
      // cubic with roots r1, r2, r3
      const r1 = rand() || 1;
      const r2 = rand() || 2;
      const r3 = rand() || -1;
      const a = 1;
      const b = -(r1 + r2 + r3);
      const c = r1*r2 + r1*r3 + r2*r3;
      const d = -r1*r2*r3;
      equation = `x³ ${b>=0?"+":""}${b}x² ${c>=0?"+":""}${c}x ${d>=0?"+":""}${d} = 0`;
      roots = [r1, r2, r3];
      solution = `Корни кубического уравнения: ${r1}, ${r2}, ${r3}`;
    }

    if (type === 4) {
      // biquadratic x^4 + px^2 + q = 0 with roots ±sqrt(r1), ±sqrt(r2)
      const r1 = Math.abs(rand() || 1);
      const r2 = Math.abs(rand() || 4);
      const p = -(r1 + r2);
      const q = r1 * r2;
      equation = `x⁴ ${p>=0?"+":""}${p}x² ${q>=0?"+":""}${q} = 0`;
      roots = [Math.sqrt(r1), -Math.sqrt(r1), Math.sqrt(r2), -Math.sqrt(r2)];
      solution = `Корни биквадратного: ±√${r1}, ±√${r2}`;
    }

    if (type === 5) {
      // System: a1 x + b1 y = c1, a2 x + b2 y = c2 with known solution (x0, y0)
      const x0 = rand() || 2;
      const y0 = rand() || -3;
      const a1 = rand() || 1;
      const b1 = rand() || -2;
      const c1 = a1*x0 + b1*y0;
      const a2 = rand() || 3;
      const b2 = rand() || 4;
      const c2 = a2*x0 + b2*y0;
      equation = `${a1}x + ${b1}y = ${c1};   ${a2}x + ${b2}y = ${c2}`;
      roots = [`x=${x0}`, `y=${y0}`];
      solution = `Решение системы: x=${x0}, y=${y0}`;
    }

    return { equation, roots, solution };
  }

  const [data, setData] = React.useState(generate());

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Генератор уравнений</h2>
      <button onClick={() => setData(generate())}>Сгенерировать</button>
      <p><b>Уравнение:</b> {data.equation}</p>
      <p><b>Корни:</b> {JSON.stringify(data.roots)}</p>
      <p><b>Решение:</b> {data.solution}</p>
    </div>
  );
}
