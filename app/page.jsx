"use client";
import React from "react";

// Вспомогательные функции
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function reduce(num, den) {
  if (den === 0) return "error";
  let g = gcd(Math.abs(num), Math.abs(den));
  num /= g; den /= g;
  if (den < 0) { num = -num; den = -den; }
  return { num, den };
}

// Красивый вывод дроби: 3/4 → ³/₄, -3/1 → -3, 5/1 → 5
function PrettyFraction({ num, den = 1 }) {
  const r = reduce(num, den);
  if (r.den === 1) return <>{r.num < 0 ? <>-{ -r.num }</> : r.num}</>;
  const absNum = Math.abs(r.num);
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      {r.num < 0 && "-"}
      <sup>{absNum}</sup>⁄<sub>{r.den}</sub>
    </span>
  );
}

// Целое случайное число в диапазоне [min, max]
function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export default function Page() {
  const [complexity, setComplexity] = React.useState(3);
  const [data, setData] = React.useState({});

  function generate() {
    let eq = "", sol = "", roots = [];

    // Диапазоны в зависимости от сложности
    const range = [
      null,
      { int: 5, fracDen: 3, root: [-5, 5] },    // 1
      { int: 10, fracDen: 5, root: [-10, 10] }, // 2
      { int: 15, fracDen: 8, root: [-15, 15] }, // 3
      { int: 25, fracDen: 10, root: [-20, 20] }, // 4
      { int: 50, fracDen: 12, root: [-30, 30] }  // 5
    ][complexity];

    const type = complexity === 1 ? rint(1, 2) :
                 complexity === 2 ? rint(1, 3) :
                 complexity === 3 ? rint(1, 5) :
                 complexity <= 5 ? rint(1, 6) : rint(1, 6);

    // === Тип 1: линейное ax + b = 0 ===
    if (type === 1) {
      const a = rint(1, complexity >= 3 ? range.int : 5);
      const rootNum = rint(range.root[0], range.root[1]);
      const rootDen = complexity >= 2 ? rint(1, range.fracDen) : 1;
      const root = reduce(rootNum, rootDen);
      const b = -a * root.num / root.den;
      const bReduced = reduce(Math.round(b * root.den), root.den); // чтобы b был красивым

      eq = <> <PrettyFraction num={a} />x + <PrettyFraction num={bReduced.num} den={bReduced.den} /> = 0 </>;
      sol = <>x = <PrettyFraction num={root.num} den={root.den} /></>;
      roots = [{ num: root.num, den: root.den }];
    }

    // === Тип 2: квадратное x² + bx + c = 0 ===
    if (type === 2) {
      const r1num = rint(range.root[0], range.root[1]);
      const r1den = complexity >= 3 ? rint(1, range.fracDen) : 1;
      const r2num = rint(range.root[0], range.root[1]);
      const r2den = complexity >= 3 ? rint(1, range.fracDen) : 1;

      const r1 = reduce(r1num, r1den);
      const r2 = reduce(r2num, r2den);

      const b = -(r1.num / r1.den + r2.num / r2.den);
      const c = (r1.num * r2.num) / (r1.den * r2.den);

      const bRed = reduce(Math.round(b * r1.den * r2.den), r1.den * r2.den);
      const cRed = reduce(Math.round(c * r1.den * r2.den), r1.den * r2.den);

      eq = <>x² {bRed.num >= 0 && "+"} <PrettyFraction num={bRed.num} den={bRed.den} />x {cRed.num >= 0 && "+"}
            <PrettyFraction num={cRed.num} den={cRed.den} /> = 0</>;
      sol = <>Корни: <PrettyFraction num={r1.num} den={r1.den} />, <PrettyFraction num={r2.num} den={r2.den} /></>;
      roots = [r1, r2];
    }

    // === Тип 3: кубическое ===
    if (type === 3 && complexity >= 4) {
      const cnt = complexity === 5 ? 4 : 3;
      const rs = Array(cnt).fill().map(() => {
        const n = rint(-20, 20);
        const d = rint(1, complexity === 5 ? 10 : 6);
        return reduce(n, d);
      });

      // Вычисление коэффициентов через Вьета (упрощённо)
      let b = 0, c = 0, d = 0, e = 1;
      for (let r of rs) {
        b -= r.num / r.den;
        // дальше можно, но ради простоты оставлю целые корни на высоких сложностях
      }
      // Пока просто целые корни для кубического на 4–5
      const rootsInt = Array(3).fill().map(() => rint(-8, 8));
      const [r1, r2, r3] = rootsInt;
      const pb = -(r1 + r2 + r3);
      const pc = r1*r2 + r1*r3 + r2*r3;
      const pd = -r1*r2*r3;

      eq = <>x³ {pb >= 0 && "+"}{pb}x² {pc >= 0 && "+"}{pc}x {pd >= 0 && "+"}{pd} = 0</>;
      sol = <>Корни: {r1}, {r2}, {r3}</>;
      roots = rootsInt;
    }

    // === Тип 4: биквадратное x⁴ + p x² + q = 0 ===
    if (type === 4 && complexity >= 4) {
      const a = rint(1, complexity === 5 ? 15 : 10);
      const b = rint(a + 1, complexity === 5 ? 20 : 12);
      const p = -(a*a + b*b);
      const q = a*a * b*b;

      eq = <>x⁴ {p >= 0 && "+"}{p}x² {q >= 0 && "+"}{q} = 0</>;
      sol = <>Корни: ±{a}, ±{b}</>;
      roots = [a, -a, b, -b];
    }

    // === Тип 5: система линейных уравнений ===
    if (type === 5 && complexity >= 3) {
      const xNum = rint(range.root[0], range.root[1]);
      const xDen = complexity >= 4 ? rint(1, range.fracDen) : 1;
      const yNum = rint(range.root[0], range.root[1]);
      const yDen = complexity >= 4 ? rint(1, range.fracDen) : 1;

      const x = reduce(xNum, xDen);
      const y = reduce(yNum, yDen);

      const a1 = rint(1, range.int);
      const b1 = rint(1, range.int);
      const a2 = rint(1, range.int);
      const b2 = rint(1, range.int);

      const c1 = a1 * x.num / x.den + b1 * y.num / y.den;
      const c2 = a2 * x.num / x.den + b2 * y.num / y.den;

      const c1r = reduce(Math.round(c1 * x.den * y.den), x.den * y.den);
      const c2r = reduce(Math.round(c2 * x.den * y.den), x.den * y.den);

      eq = <>
        <PrettyFraction num={a1} />x + <PrettyFraction num={b1} />y = <PrettyFraction num={c1r.num} den={c1r.den} /><br/>
        <PrettyFraction num={a2} />x + <PrettyFraction num={b2} />y = <PrettyFraction num={c2r.num} den={c2r.den} />
      </>;
      sol = <>x = <PrettyFraction num={x.num} den={x.den} />, y = <PrettyFraction num={y.num} den={y.den} /></>;
      roots = [{ x, y }];
    }

    // === Тип 6: 1/x (пропорция) ===
    if (type === 6) {
      const a = rint(1, range.int);
      const rootNum = rint(1, complexity >= 4 ? 20 : 10);
      const rootDen = complexity >= 3 ? rint(1, range.fracDen) : 1;
      const root = reduce(rootNum, rootDen);
      const b = reduce(a * root.den, root.num); // a / x = b

      eq = <><PrettyFraction num={a} /> / x = <PrettyFraction num={b.num} den={b.den} /></>;
      sol = <>x = <PrettyFraction num={root.num} den={root.den} /></>;
      roots = [root];
    }

    return { eq, sol, roots };
  }

  React.useEffect(() => {
    setData(generate());
  }, [complexity]);

  return (
    <div style={{ padding: 30, fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <h1>Генератор уравнений (с красивыми дробями)</h1>

      <div style={{ marginBottom: 20 }}>
        <label><b>Сложность:</b> {complexity} </label>
        <input
          type="range"
          min="1"
          max="5"
          value={complexity}
          onChange={(e) => setComplexity(+e.target.value)}
          style={{ width: 300, marginLeft: 10 }}
        />
      </div>

      <button onClick={() => setData(generate())} style={{ padding: "10px 20px", fontSize: 16 }}>
        Новый пример
      </button>

      <div style={{ marginTop: 30, padding: 20, background: "#f9f9f9", borderRadius: 8 }}>
        <p><b>Уравнение:</b></p>
        <div style={{ fontSize: 24, margin: "15px 0" }}>{data.eq || "..."}</div>

        <p><b>Решение:</b></p>
        <div style={{ fontSize: 22, color: "#d00", margin: "15px 0" }}>{data.sol || "..."}</div>
      </div>

      <details style={{ marginTop: 20 }}>
        <summary>Показать корни в JSON (для отладки)</summary>
        <pre>{JSON.stringify(data.roots, null, 2)}</pre>
      </details>
    </div>
  );
}