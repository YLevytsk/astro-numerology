import { useState } from "react";
import "../assets/css/argon-design-system.css";
import "../assets/css/custom.css";
import { qualityProfiles } from "../assets/js/qualityProfiles";
import { derivedProfiles } from "../assets/js/derivedProfiles";

export default function PythagorasMatrix() {
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2000");
  const [result, setResult] = useState(null);

  function calculatePythagorasMatrix(dateStr) {
    const digits = dateStr.replaceAll("-", "").split("").map(Number);

    const sum1 = digits.reduce((a, b) => a + b, 0);
    const sum2 = String(sum1).split("").reduce((a, b) => a + Number(b), 0);

    const firstDigit = digits[0];
    const third = sum1 - firstDigit * 2;
    const thirdDigits = String(Math.abs(third)).split("").map(Number);
    const sum3 = thirdDigits.reduce((a, b) => a + b, 0);

    const allDigits = [
      ...digits,
      ...String(sum1),
      ...String(sum2),
      ...thirdDigits,
      ...String(sum3),
    ]
      .map(Number)
      .filter((n) => !isNaN(n));

    const matrix = {};
    for (let i = 1; i <= 9; i++) {
      matrix[i] = allDigits.filter((d) => d === i).join("") || "";
    }

    return matrix;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const monthIndex = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].indexOf(month);

    const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const matrix = calculatePythagorasMatrix(date);

    setResult({
      date: `${day} ${month} ${year}`,
      matrix: [
        [matrix[1], matrix[4], matrix[7]],
        [matrix[2], matrix[5], matrix[8]],
        [matrix[3], matrix[6], matrix[9]],
      ],
      matrixRaw: matrix,
    });
  };

  return (
    <section className="pythagoras-section py-5">
      <div className="container">
        <div className="card shadow border-0 bg-transparent">
          <div className="card-body text-center">
            <h2 className="mb-2">
              Pythagoras Square
              <span className="d-block text-muted small">
                Online calculation by classical numerology
              </span>
            </h2>

            {/* форма */}
            <form
              className="row g-3 justify-content-center mt-4"
              onSubmit={handleSubmit}
            >
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  {Array.from({ length: 101 }, (_, i) => (
                    <option key={1925 + i}>{1925 + i}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 mt-3">
                <button type="submit" className="btn btn-primary">
                  Calculate Pythagoras Square
                </button>
                <button
    type="button"
    className="btn btn-outline-secondary"
    onClick={() => setResult(null)}
  >
    Reset
  </button>
              </div>
            </form>

            {/* результат */}
            {result && (
              <div
                className="mt-4 p-3 border rounded bg-transparent"
                id="calc-result"
              >
                <h4>Calculation Result:</h4>
                <p>Date of birth: {result.date}</p>

                {/* сетка 3×3 */}
                <div className="matrix-grid">
                  {result.matrix.map((row, rowIndex) => (
                    <div className="matrix-row" key={rowIndex}>
                      {row.map((cell, colIndex) => {
                        const hasValue = !!cell && String(cell).length > 0;
                        return (
                          <div
                            key={colIndex}
                            className={`matrix-cell ${
                              hasValue ? "has-value" : "empty"
                            }`}
                            title={hasValue ? `Digits: ${cell}` : "No digits"}
                            aria-label={hasValue ? `Digits: ${cell}` : "No digits"}
                          >
                            {hasValue ? cell : "—"}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Quality Power Levels */}
                <div className="quality-power-section mt-5">
                  <div className="quality-power-block p-4 rounded">
                    <h4 className="mb-4">Strength of Qualities</h4>
                    {[
                      { bars: 0, title: "No digits", desc: "Quality is absent" },
                      { bars: 1, title: "1 digit", desc: "Quality is given at base level" },
                      { bars: 2, title: "2 digits", desc: "Strengthened quality" },
                      { bars: 3, title: "3 digits", desc: "Impulsive quality" },
                      { bars: 4, title: "4 digits", desc: "Extra quality" },
                      { bars: 5, title: "5 digits", desc: "Maximum quality" },
                      { bars: 6, title: "5+ digits", desc: "Quality overload" },
                    ].map((item, idx) => (
                      <div className="d-flex align-items-center mb-3" key={idx}>
                        <div className="d-flex quality-bars me-3">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={i}
                              className={`bar ${i < item.bars ? "active" : ""}`}
                            ></div>
                          ))}
                        </div>
                        <div className="quality-line">
                          <strong>{item.title}</strong>
                          <span className="text-muted"> — {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reference cards */}
                <div className="row mt-4">
                  <div className="col-12 mb-4">
                    <div className="card border-0 shadow h-100">
                      <div className="card-body text-start">
                        <h5 className="text-primary">
                          Empty cells — is it a verdict?
                        </h5>
                        <p className="text-muted">
                          Empty cells do not mean that a person is “talentless” in that
                          quality from birth. It means they start from zero in that area.
                        </p>
                        <p className="text-muted">
                          Over a lifetime, an initially empty quality can be developed.
                          However, it will be harder to catch up with those who were born
                          with 4 or more digits in the same quality, which indicates a
                          natural talent.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mb-4">
                    <div className="card border-0 shadow h-100">
                      <div className="card-body text-start">
                        <h5 className="text-primary">
                          Many empty cells in those born in the 2000s
                        </h5>
                        <p className="text-muted">
                          People born in the 2000s often have many empty cells in their
                          Pythagoras square. Some get upset by this. Some try to “add
                          numbers” through the so-called “Ideal” system, which we are
                          familiar with but do not agree with.
                        </p>
                        <p className="text-muted">
                          Our view: people of the 2000s do not have such a strict,
                          predefined set of inborn qualities as those from the previous
                          century. This gives them more freedom to develop in different
                          directions and to create their own unique successful combination
                          of qualities. We sincerely wish them luck in this!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* descriptions */}
                <div className="card border-0 shadow mt-4">
                  <div className="card-body text-start">
                    <h5 className="text-primary mb-4">Description of qualities</h5>

                    {Object.entries(result.matrixRaw).map(([num, value]) => {
                      const count = value.length;
                      const profile = qualityProfiles[num];
                      if (!profile) return null;

                      let description = profile.levels[count];
                      if (!description) {
                        const maxKey = Math.max(
                          ...Object.keys(profile.levels).map(Number)
                        );
                        description = profile.levels[maxKey];
                      }

                      return (
                        <div key={num} className="mb-3">
                          <p className="fw-bold mb-2">
                            {profile.label} {value || "—"}
                          </p>
                          <p className="text-muted mb-0">{description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

            {/* Derived Qualities */}
<div className="card border-0 shadow mt-4">
  <div className="card-body text-start">
    <h5 className="text-primary mb-4">Derived qualities</h5>

    {Object.entries(derivedProfiles).map(([key, profile]) => {
      const lineCount = {
        selfEsteem:
          (result.matrix[0][0] + result.matrix[1][0] + result.matrix[2][0]).length,
        family:
          (result.matrix[0][1] + result.matrix[1][1] + result.matrix[2][1]).length,
        intellect:
          (result.matrix[0][2] + result.matrix[1][2] + result.matrix[2][2]).length,
        physicalPlane:
          (result.matrix[0][0] + result.matrix[0][1] + result.matrix[0][2]).length,
        spiritualPlane:
          (result.matrix[1][0] + result.matrix[1][1] + result.matrix[1][2]).length,
        socialPlane:
          (result.matrix[2][0] + result.matrix[2][1] + result.matrix[2][2]).length,
        selfRealization:
          (result.matrix[0][0] + result.matrix[1][1] + result.matrix[2][2]).length,
        spirituality:
          (result.matrix[2][0] + result.matrix[1][1] + result.matrix[0][2]).length,
      }[key];

      // Подбор текста по количеству
      let description = profile.levels[lineCount];
      if (!description) {
        const maxKey = Math.max(...Object.keys(profile.levels).map(Number));
        description = profile.levels[maxKey];
      }

      return (
        <div key={key} className="mb-3">
          <p className="fw-bold mb-2">
            {profile.label}: {lineCount > 0 ? lineCount : "—"}
          </p>
          <p className="text-muted mb-0">{description}</p>
        </div>
      );
    })}
  </div>
</div>

              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
