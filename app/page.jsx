"use client";

import React from "react";
import dynamic from "next/dynamic";

const BlockMath = dynamic(
  () => import("react-katex").then((mod) => mod.BlockMath),
  { ssr: false }
);

// ===================== ВСПОМОГАТЕЛЬНЫЕ =====================
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { let t = b; b = a % b; a = t; }
  return a || 1;
}

function reduce(n, d = 1) {
  if (d === 0) return { n: 0, d: 1 };
  let g = gcd(n, d);
  n /= g; d /= g;
  if (d < 0) { n = -n; d = -d; }
  return { n, d };
}

function rint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function frac(n, d = 1) {
  const r = reduce(n, d);
  if (r.d === 1) return r.n < 0 ? `- ${-r.n}` : `${r.n}`;
  if (r.n === 0) return "0";
  return `${r.n < 0 ? "-" : ""}\\frac{${Math.abs(r.n)}}{${r.d}}`;
}

function sign(num) {
  return num >= 0 ? "+" : "";
}

// ===================== ГЕНЕРАТОР =====================
export default function Page() {
  const [complexity, setComplexity] = React.useState(4);
  const [task, setTask] = React.useState(null);

  React.useEffect(() => {
    import("katex/dist/katex.min.css");
  }, []);

  const generate = () => {
    const typesByComplexity = {
      1: [1],
      2: [1, 2],
      3: [1, 2, 5, 6],
      4: [2, 3, 4, 5, 6],
      5: [2, 3, 4, 5, 6]
    };

    const allowedTypes = typesByComplexity[complexity] || [2, 3, 4, 5, 6];
    const type = allowedTypes[rint(0, allowedTypes.length - 1)];

    const maxCoef = complexity <= 2 ? 12 : complexity === 3 ? 20 : complexity === 4 ? 35 : 70;
    const rootRange = complexity <= 2 ? 10 : complexity === 3 ? 18 : complexity === 4 ? 30 : 50;
    const maxDen = complexity <= 2 ? 3 : complexity === 3 ? 6 : complexity === 4 ? 10 : 12;

    let equation = "", solution = [], answer = "";

    // ===================== 1. Линейное =====================
    if (type === 1) {
      const a = rint(3, maxCoef);
      const rootN = rint(-rootRange, rootRange);
      const rootD = rint(2, maxDen);
      const root = reduce(rootN, rootD);
      const b = reduce(-a * root.n, root.d);

      equation = `${a}x ${b.n >= 0 ? "+" : ""}${frac(b.n, b.d)} = 0`;
      solution = [
        `${a}x = ${frac(-b.n, b.d)}`,
        `x = ${frac(-b.n, b.d)} : ${a}`,
        `x = ${frac(root.n, root.d)}`
      ];
      answer = `x = ${frac(root.n, root.d)}`;
    }

    // ===================== 2. Квадратное =====================
    else if (type === 2) {
      const r1n = rint(-rootRange, rootRange);
      const r1d = rint(2, maxDen);
      const r2n = rint(-rootRange, rootRange);
      const r2d = rint(2, maxDen);

      const r1 = reduce(r1n, r1d);
      const r2 = reduce(r2n, r2d);
      const a = rint(complexity >= 4 ? 2 : 1, 9);

      const sum = r1.n / r1.d + r2.n / r2.d;
      const prod = (r1.n / r1.d) * (r2.n / r2.d);

      const commonD = r1.d * r2.d;
      const bNum = Math.round(-sum * commonD);
      const cNum = Math.round(prod * commonD);
      const b = reduce(bNum, commonD);
      const c = reduce(cNum, commonD);

      const D = b.n * b.n * c.d * c.d - 4 * a * c.n * c.n * b.d * b.d;
      const sqrtD = Math.sqrt(D / (b.d * b.d * c.d * c.d));

      equation = `${a > 1 ? a : ""}x^2 ${b.n !== 0 ? (b.n > 0 ? "+" : "") + frac(b.n, b.d) + "x" : ""} ${c.n >= 0 ? "+" : ""}${frac(c.n, c.d)} = 0`;

      solution = [
        "\\text{1. По теореме Виета:}",
        `x_1 + x_2 = ${frac(-b.n, b.d)}, \\quad x_1 x_2 = ${frac(c.n, c.d)}`,
        `\\Rightarrow x_1 = ${frac(r1.n, r1.d)}, \\quad x_2 = ${frac(r2.n, r2.d)}`,
        "",
        "\\text{2. Через дискриминант:}",
        `D = \\left(${frac(b.n, b.d)}\\right)^2 - 4\\cdot${a}\\cdot${frac(c.n, c.d)} = ${frac(D, b.d * b.d * c.d * c.d)}`,
        `\\sqrt{D} = ${frac(Math.round(sqrtD * 100), 100)}`,
        `x_{1,2} = \\frac{${frac(-b.n, b.d)} \\pm \\sqrt{D}}{${2*a}}`,
        `x_1 = ${frac(r1.n, r1.d)}, \\quad x_2 = ${frac(r2.n, r2.d)}`
      ];
      answer = `x_1 = ${frac(r1.n, r1.d)}, \\; x_2 = ${frac(r2.n, r2.d)}`;
    }

    // ===================== 3. Кубическое =====================
    else if (type === 3) {
      const rational = rint(-8, 8);
      const r2 = rint(-12, 12);
      const r3 = rint(-12, 12);
      const a = complexity >= 5 ? rint(2, 6) : 1;

      const p = a * -(rational + r2 + r3);
      const q = a * (rational * r2 + rational * r3 + r2 * r3);
      const r = a * -(rational * r2 * r3);

      const ax = a > 1 ? `${a}x^3` : "x^3";
      equation = `${ax} ${sign(p)}${p}x^2 ${sign(q)}${q}x ${sign(r)}${r} = 0`;

      solution = [
        `\\text{Ищем рациональный корень среди делителей ${r}: \\pm1, \\pm${Math.abs(r)}, ...}`,
        `\\text{Пробуем } x = ${rational}:`,
        `${a > 1 ? a : ""}(${rational})^3 ${sign(p)} ${p}(${rational})^2 ${sign(q)} ${q}(${rational}) ${sign(r)} ${r} = 0 \\quad \\checkmark`,
        "",
        `\\text{Делим многочлен на }(x - ${rational}) \\text{ (схема Горнера или синтетическое деление):}`,
        `\\Rightarrow (x - ${rational})(x^2 + ${(r2 + rational)}x + ${r2 * rational + r3 * rational + r2 * r3}) = 0 \\quad \\text{(при a=1)}`,
        a > 1 ? `\\text{Учитывая старший коэффициент } ${a}: ${a}(x - ${rational})(x^2 + ...)` : "",
        "",
        `x^2 + ${(r2 + rational)}x + ${r2 * rational + r3 * rational + r2 * r3} = 0`,
        `D = ${(r2 + rational)}^2 - 4\\cdot${r2 * rational + r3 * rational + r2 * r3} = ${(r2 + rational)^2 - 4*(r2 * rational + r3 * rational + r2 * r3)}`,
        `\\text{Корни: } x = ${rational},\\ ${r2},\\ ${r3}`
      ];
      answer = `x = ${rational},\\ ${r2},\\ ${r3}`;
    }

    // ===================== 4. Биквадратное =====================
    else if (type === 4) {
      const p = rint(3, complexity >= 4 ? 20 : 12);
      const q = rint(p + 3, complexity >= 4 ? 30 : 18);

      const b = -(p*p + q*q);
      const c = p*p * q*q;
      const D = b*b - 4*c;
      const sqrtD = 2 * p * q;

      equation = `x^4 ${b >= 0 ? "+" : ""}${b}x^2 + ${c} = 0`;

      solution = [
        "\\text{Биквадратное уравнение. Делаем замену } z = x^2:",
        `z^2 ${b >= 0 ? "+" : ""}${b}z + ${c} = 0`,
        "",
        "\\text{Дискриминант вспомогательного уравнения:}",
        `D = (${b})^2 - 4\\cdot1\\cdot${c} = ${b*b} - ${4*c} = ${D}`,
        `\\sqrt{D} = \\sqrt{${D}} = ${sqrtD}`,
        "",
        "\\text{Корни:}",
        `z_{1,2} = \\frac{-${b} \\pm \\sqrt{D}}{2}`,
        `z_1 = \\frac{${-b} + ${sqrtD}}{2} = \\frac{${-b + sqrtD}}{2} = ${p*p}`,
        `z_2 = \\frac{${-b} - ${sqrtD}}{2} = \\frac{${-b - sqrtD}}{2} = ${q*q}`,
        "",
        `z_1 = ${p*p} > 0, \\quad z_2 = ${q*q} > 0 \\quad \\Rightarrow \\quad \\text{четыре вещественных корня}`,
        "",
        `x^2 = ${p*p} \\quad \\Rightarrow \\quad x = \\pm ${p}`,
        `x^2 = ${q*q} \\quad \\Rightarrow \\quad x = \\pm ${q}`,
        "",
        "\\text{Ответ: четыре корня}"
      ];
      answer = `x = \\pm ${p}, \\; x = \\pm ${q}`;
    }

    // ===================== 5. Система 2x2 =====================
    else if (type === 5) {
      const x = reduce(rint(-25, 25), rint(2, maxDen));
      const y = reduce(rint(-25, 25), rint(2, maxDen));

      const a1 = rint(2, 18), b1 = rint(2, 18);
      const a2 = rint(2, 18), b2 = rint(2, 18);

      const c1 = reduce(a1 * x.n * y.d + b1 * y.n * x.d, x.d * y.d);
      const c2 = reduce(a2 * x.n * y.d + b2 * y.n * x.d, x.d * y.d);

      // Вычисляем определитель для красоты
      const det = a1 * b2 - a2 * b1;

      equation = `${a1}x ${b1 >= 0 ? "+" : ""}${b1}y = ${frac(c1.n, c1.d)} \\\\ ${a2}x ${b2 >= 0 ? "+" : ""}${b2}y = ${frac(c2.n, c2.d)}`;

      solution = [
        "\\text{Решим систему методом вычитания:}",
        `(1) \\quad ${a1}x ${b1 >= 0 ? "+" : ""}${b1}y = ${frac(c1.n, c1.d)}`,
        `(2) \\quad ${a2}x ${b2 >= 0 ? "+" : ""}${b2}y = ${frac(c2.n, c2.d)}`,
        "",
        `\\text{Умножим (1) на ${b2}, (2) на ${b1}:}`,
        `${a1*b2}x ${b1*b2 >= 0 ? "+" : ""}${b1*b2}y = ${frac(c1.n*b2, c1.d)}`,
        `${a2*b1}x ${b2*B1 >= 0 ? "+" : ""}${b2*b1}y = ${frac(c2.n*b1, c2.d)}`,
        "",
        `\\text{Вычтем: } (${a1*b2 - a2*b1})x = ${frac(c1.n*b2/c1.d - c2.n*b1/c2.d, 1)}`,
        `${det}x = ${frac((c1.n*b2 - c2.n*b1), c1.d)}`,
        `x = ${frac(x.n, x.d)}`,
        "",
        `\\text{Подставляем в (1):}`,
        `${a1}\\cdot${frac(x.n, x.d)} ${b1 >= 0 ? "+" : ""}${b1}y = ${frac(c1.n, c1.d)}`,
        `${b1}y = ${frac(c1.n, c1.d)} ${a1*x.n < 0 ? "+" : "-"} ${frac(Math.abs(a1*x.n), x.d)}`,
        `y = ${frac(y.n, y.d)}`
      ];
      answer = `x = ${frac(x.n, x.d)}, \\; y = ${frac(y.n, y.d)}`;
    }

    // ===================== 6. Пропорция =====================
    else if (type === 6) {
      const a = rint(5, maxCoef);
      const root = reduce(rint(3, 40), rint(2, maxDen));
      const denom1 = rint(5, 25);
      const num2 = rint(10, 40);
      const denom2 = reduce(a * root.d, root.n);

      equation = `\\frac{${a}x}{${denom1}} = \\frac{${num2}}{${frac(denom2.n, denom2.d)}}`;

      solution = [
        `\\text{Умножим крест-накрест:}`,
        `${a}x \\cdot ${frac(denom2.n, denom2.d)} = ${num2} \\cdot ${denom1}`,
        `${a}x = ${num2} \\cdot ${denom1} \\cdot ${frac(denom2.n, denom2.d)}`,
        `${a}x = ${num2 * denom1 * denom2.n / denom2.d}`,
        `x = ${frac(root.n, root.d)}`
      ];
      answer = `x = ${frac(root.n, root.d)}`;
    }

    setTask({ equation, solution: solution.filter(Boolean), answer });
  };

  React.useEffect(() => {
    generate();
  }, [complexity]);

  return (
    <div style={{ padding: 40, fontFamily: "Georgia, serif", maxWidth: 960, margin: "0 auto", lineHeight: 1.8 }}>
      <h1 style={{ textAlign: "center", marginBottom: 30, fontSize: 32 }}>Генератор уравнений</h1>

      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <span style={{ fontSize: 24, marginRight: 20 }}>Сложность: {complexity}</span>
        <input
          type="range"
          min="1"
          max="5"
          value={complexity}
          onChange={(e) => setComplexity(+e.target.value)}
          style={{ width: 450, height: 12 }}
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
          <div style={{ background: "white", padding: 30, borderRadius: 12, lineHeight: 2.4 }}>
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