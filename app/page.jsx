"use client";

import React from "react";
import dynamic from "next/dynamic";

const BlockMath = dynamic(
  () => import("react-katex").then((mod) => mod.BlockMath),
  { ssr: false }
);

// ===================== ВСПОМОГАТЕЛЬНЫЕ =====================
function rint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { let t = b; b = a % b; a = t; }
  return a || 1;
}

function reduce(n, d = 1) {
  if (d === 0) return { n: 0, d: 1 };
  const g = gcd(n, d);
  n /= g; d /= g;
  if (d < 0) { n = -n; d = -d; }
  return { n, d };
}

function frac(n, d = 1) {
  const r = reduce(n, d);
  if (r.n === 0) return "0";
  if (r.d === 1) return r.n < 0 ? `- ${-r.n}` : `${r.n}`;
  return `${r.n < 0 ? "-" : ""}\\frac{${Math.abs(r.n)}}{${r.d}}`;
}

// ===================== ГЕНЕРАТОР =====================
export default function Page() {
  const [complexity, setComplexity] = React.useState(1);
  const [task, setTask] = React.useState(null);

  React.useEffect(() => {
    import("katex/dist/katex.min.css");
  }, []);

  const generate = () => {
    // ПЛАВНАЯ ГРАДАЦИЯ — КАК В УЧЕБНИКЕ!
    const typeConfig = {
      1: { types: [1], maxCoef: 15, maxDen: 1, rootRange: 20 },        // только целые линейные
      2: { types: [1, 2], maxCoef: 20, maxDen: 1, rootRange: 25, simpleQuad: true },
      3: { types: [2, 5, 6], maxCoef: 12, maxDen: 6, rootRange: 20, simpleQuad: true },
      4: { types: [2, 3, 4, 5, 6], maxCoef: 30, maxDen: 10, rootRange: 40 },
      5: { types: [2, 3, 4, 5, 6], maxCoef: 70, maxDen: 12, rootRange: 60 }
    };

    const config = typeConfig[complexity] || typeConfig[5];
    const type = config.types[rint(0, config.types.length - 1)];

    let equation = "", solution = [], answer = "";

    // ===================== 1. Линейное =====================
    if (type === 1) {
      const a = rint(2, config.maxCoef);
      const root = rint(-config.rootRange, config.rootRange);
      const b = -a * root;

      equation = `${a}x ${b >= 0 ? "+" : ""}${b} = 0`;
      solution = [
        `${a}x = ${-b}`,
        `x = ${root}`
      ];
      answer = `x = ${root}`;
    }

    // ===================== 2. Квадратное =====================
    else if (type === 2) {
      let r1, r2, a = 1;

      if (config.simpleQuad) {
        // Сложность 2–3: только целые корни или простые дроби
        r1 = rint(-12, 12);
        r2 = rint(-12, 12);
        if (complexity === 3) a = rint(1, 3); // иногда a=2,3
      } else {
        // Сложность 4+: любые дроби
        r1 = reduce(rint(-30, 30), rint(2, config.maxDen)).n / reduce(rint(-30, 30), rint(2, config.maxDen)).d;
        r2 = reduce(rint(-30, 30), rint(2, config.maxDen)).n / reduce(rint(-30, 30), rint(2, config.maxDen)).d;
        a = complexity >= 4 ? rint(2, 8) : 1;
      }

      const sum = -(r1 + r2);
      const prod = r1 * r2;
      const b = Math.round(sum * 10);
      const c = Math.round(prod * 10);

      equation = `${a > 1 ? a : ""}x^2 ${b >= 0 ? "+" : ""}${Math.abs(b) === 0 ? "" : frac(b, 10) + "x"} ${c >= 0 ? "+" : ""}${frac(c, 10)} = 0`;

      solution = [
        complexity <= 3 ? "\\text{Подбором или по Виета:}" : "\\text{По теореме Виета:}",
        `x_1 + x_2 = ${frac(-b, 10)}, \\quad x_1 x_2 = ${frac(c, 10)}`,
        `x_1 = ${r1}, \\quad x_2 = ${r2}`
      ];
      answer = `x_1 = ${r1}, \\; x_2 = ${r2}`;
    }

    // ===================== 3. Кубическое (только с сложности 4+) =====================
    else if (type === 3 && complexity >= 4) {
      const r1 = rint(-5, 5) || 1;
      const r2 = rint(-8, 8);
      const r3 = rint(-8, 8);
      const a = complexity === 5 ? rint(2, 4) : 1;

      const p = a * (r1 + r2 + r3);
      const q = a * (r1*r2 + r1*r3 + r2*r3);
      const r = a * (-r1*r2*r3);

      equation = `${a > 1 ? a : ""}x^3 ${p >= 0 ? "-" : "+"}${Math.abs(p)}x^2 ${q >= 0 ? "+" : "-"}${Math.abs(q)}x ${r >= 0 ? "+" : "-"}${Math.abs(r)} = 0`;

      solution = [
        `\\text{Рациональный корень: } x = ${r1}`,
        `\\text{После деления получаем квадратное уравнение с корнями } ${r2},\\ ${r3}`
      ];
      answer = `${r1},\\ ${r2},\\ ${r3}`;
    }

    // ===================== 4. Биквадратное (с 4+) =====================
    else if (type === 4 && complexity >= 4) {
      const p = rint(3, 15);
      const q = rint(p + 2, 20);
      const b = -(p*p + q*q);
      const c = p*p * q*q;

      equation = `x^4 ${b >= 0 ? "+" : ""}${b}x^2 + ${c} = 0`;
      solution = [
        `z = x^2 \\quad \\to\\quad z^2 ${b >= 0 ? "+" : ""}${b}z + ${c} = 0`,
        `z_1 = ${p*p}, \\; z_2 = ${q*q}`,
        `x = \\pm ${p}, \\; x = \\pm ${q}`
      ];
      answer = `\\pm ${p}, \\; \\pm ${q}`;
    }

    // ===================== 5. Система 2x2 =====================
    else if (type === 5) {
      const x = reduce(rint(-15, 15), complexity <= 3 ? 1 : rint(2, 6));
      const y = reduce(rint(-15, 15), complexity <= 3 ? 1 : rint(2, 6));
      const a1 = rint(2, complexity <= 3 ? 8 : 12);
      const b1 = rint(2, complexity <= 3 ? 8 : 12);
      const a2 = rint(2, complexity <= 3 ? 8 : 12);
      const b2 = rint(2, complexity <= 3 ? 8 : 12);

      const c1 = reduce(a1 * x.n + b1 * y.n, x.d * y.d);
      const c2 = reduce(a2 * x.n + b2 * y.n, x.d * y.d);

      equation = `${a1}x ${b1 >= 0 ? "+" : ""}${b1}y = ${frac(c1.n, c1.d)} \\\\ ${a2}x ${b2 >= 0 ? "+" : ""}${b2}y = ${frac(c2.n, c2.d)}`;

      solution = [
        complexity <= 3 ? "\\text{Решаем подстановкой:}" : "\\text{Методом вычитания:}",
        `x = ${frac(x.n, x.d)}, \\; y = ${frac(y.n, y.d)}`
      ];
      answer = `x = ${frac(x.n, x.d)}, \\; y = ${frac(y.n, y.d)}`;
    }

    // ===================== 6. Пропорция =====================
    else if (type === 6) {
      const a = rint(3, complexity <= 3 ? 10 : 20);
      const root = reduce(rint(5, 30), complexity <= 3 ? rint(1, 3) : rint(2, 8));
      const d1 = rint(5, complexity <= 3 ? 15 : 25);
      const n2 = rint(8, complexity <= 3 ? 25 : 40);
      const d2 = reduce(a * root.d, root.n);

      equation = `\\frac{${a}x}{${d1}} = \\frac{${n2}}{${frac(d2.n, d2.d)}}`;
      solution = [
        `${a}x = ${n2} \\cdot ${d1} \\cdot ${frac(d2.n, d2.d)}`,
        `x = ${frac(root.n, root.d)}`
      ];
      answer = `x = ${frac(root.n, root.d)}`;
    }

    setTask({ equation, solution: solution.filter(Boolean), answer });
  };

  React.useEffect(() => { generate(); }, [complexity]);

  return (
    <div style={{ padding: 40, fontFamily: "Georgia, serif", maxWidth: 960, margin: "0 auto", lineHeight: 1.8 }}>
      <h1 style={{ textAlign: "center", marginBottom: 30, fontSize: 32 }}>
        Генератор уравнений — Идеальная градация
      </h1>

      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <span style={{ fontSize: 24, marginRight: 20 }}>Сложность: {complexity}</span>
        <input
          type="range" min="1" max="5" value={complexity}
          onChange={(e) => setComplexity(+e.target.value)}
          style={{ width: 500, height: 12 }}
        />
        <button onClick={generate} style={{ marginLeft: 30, padding: "14px 32px", fontSize: 18, borderRadius: 8 }}>
          Новый пример
        </button>
      </div>

      {task && (
        <div style={{ background: "#f8f9fa", padding: 40, borderRadius: 20, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
          <h2 style={{ color: "#1976d2", fontSize: 28 }}>Задача:</h2>
          <div style={{ fontSize: 32, textAlign: "center", padding: "30px 0", background: "white", borderRadius: 12 }}>
            <BlockMath>{task.equation}</BlockMath>
          </div>

          <h2 style={{ color: "#1976d2", marginTop: 50, fontSize: 28 }}>Решение:</h2>
          <div style={{ background: "white", padding: 35, borderRadius: 12, lineHeight: 2.8 }}>
            {task.solution.map((line, i) => line ? <BlockMath key={i}>{line}</BlockMath> : <br key={i} />)}
          </div>

          <h2 style={{ color: "#d32f2f", marginTop: 50, fontSize: 28 }}>Ответ:</h2>
          <div style={{ fontSize: 28, textAlign: "center", padding: 20, background: "#ffebee", borderRadius: 12 }}>
            <BlockMath>{task.answer}</BlockMath>
          </div>
        </div>
      )}
    </div>
  );
}