const DataTableCard = ({
  title,
  kicker,
  subtitle,
  columns,
  rows = [],
  emptyTitle,
  emptyMessage,
  accent = "#3b82f6",
  headerActions = null,
}) => {
  return (
    <div
      className="panel"
      style={{
        padding: "24px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 0 auto",
          height: "120px",
          background: `linear-gradient(135deg, ${accent}24, transparent 72%)`,
          pointerEvents: "none",
        }}
      />

      {(kicker || title || subtitle || headerActions) && (
        <div
          style={{
            marginBottom: "18px",
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            alignItems: "flex-start",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          <div style={{ maxWidth: "720px" }}>
            {kicker && <p className="page-kicker">{kicker}</p>}
            {title && (
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  letterSpacing: "-0.04em",
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  margin: "8px 0 0",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {headerActions ? <div style={{ position: "relative" }}>{headerActions}</div> : null}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="empty-state" style={{ paddingInline: 0 }}>
          <h3>{emptyTitle}</h3>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            border: "1px solid var(--border-subtle)",
            borderRadius: "22px",
            background: "rgba(255,255,255,0.02)",
            position: "relative",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: "680px" }}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    style={{
                      padding: "16px 16px",
                      textAlign: "left",
                      color: "var(--text-faint)",
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      background: "rgba(148,163,184,0.08)",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id || index}
                  style={{
                    background: index % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                  }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      style={{
                        padding: "16px",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        verticalAlign: "top",
                        borderBottom:
                          index === rows.length - 1 ? "none" : "1px solid var(--border-subtle)",
                      }}
                    >
                      {column.render ? column.render(row, index) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataTableCard;
