import { Link } from "react-router-dom";
import {
  ArrowRight,
  Car,
  CalendarCheck,
  CreditCard,
  Droplet,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import bgImage from "../assets/landing-bg.jpg";
import BrandLogo from "../components/BrandLogo";

const categories = [
  { icon: Zap, label: "Electrician", detail: "Repairs, wiring, and installation" },
  { icon: Droplet, label: "Plumbing", detail: "Leak fixes, fittings, and water systems" },
  { icon: Sparkles, label: "Cleaning", detail: "Home cleaning and deep sanitization" },
  { icon: Car, label: "Mechanic", detail: "Vehicle diagnostics and maintenance" },
];

const highlights = [
  {
    title: "Verified local professionals",
    text: "Discover providers near you with clearer service details and a more reliable booking flow.",
    icon: ShieldCheck,
  },
  {
    title: "Fast booking experience",
    text: "Compare services, pick a time, and manage appointments from one organized dashboard.",
    icon: CalendarCheck,
  },
  {
    title: "Built for everyday tasks",
    text: "From urgent repairs to routine upkeep, the platform helps users act quickly and confidently.",
    icon: Star,
  },
];

const steps = [
  {
    number: "01",
    title: "Choose a service",
    description: "Browse local providers, compare pricing, and filter by category or location.",
  },
  {
    number: "02",
    title: "Book in a few clicks",
    description: "Schedule the service you need through a simple, guided booking flow.",
  },
  {
    number: "03",
    title: "Track and manage",
    description: "Stay updated on approvals, payments, and reviews from your personal dashboard.",
  },
];

const roles = [
  {
    role: "User",
    title: "For customers who need trusted help fast",
    description:
      "Search local services, compare providers, book appointments, and leave reviews after each completed job.",
    icon: CalendarCheck,
    accent: "rgba(59,130,246,0.2)",
    points: ["Browse categories and compare options", "Track bookings, payments, and feedback"],
  },
  {
    role: "Provider",
    title: "For professionals growing their local business",
    description:
      "Publish services, manage incoming bookings, respond to customer demand, and build credibility through reviews.",
    icon: Wrench,
    accent: "rgba(20,184,166,0.2)",
    points: ["List services and manage availability", "Monitor bookings, reviews, and analytics"],
  },
  {
    role: "Admin",
    title: "For teams overseeing platform quality",
    description:
      "Review users, providers, bookings, services, and ratings from one operational workspace built for visibility.",
    icon: ShieldCheck,
    accent: "rgba(248,113,113,0.18)",
    points: ["Monitor activity across all roles", "Keep services and reviews healthy"],
  },
];

const paymentFlow = [
  {
    title: "Book first",
    description: "Customers choose a service and send a booking request from the dashboard.",
  },
  {
    title: "Pay after approval",
    description: "Once a provider approves the request, the booking becomes payment-ready.",
  },
  {
    title: "Use the method you prefer",
    description:
      "The payment screen supports card, UPI ID, and UPI QR so checkout stays flexible. Payment confirmation works when the website and the payment device are connected to the same Wi-Fi network.",
  },
];

const LandingPage = () => {
  return (
    <div className="landing-shell">
      <section
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundImage: `linear-gradient(135deg, rgba(7,12,22,0.82), rgba(7,12,22,0.52)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(20,184,166,0.2), transparent 26%), radial-gradient(circle at left center, rgba(59,130,246,0.22), transparent 30%)",
          }}
        />

        <nav
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "18px",
            flexWrap: "wrap",
            padding: "24px clamp(20px, 5vw, 64px)",
          }}
        >
          <BrandLogo variant="inverse" />

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "40px clamp(20px, 5vw, 64px) 72px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "28px",
            alignItems: "center",
          }}
        >
          <div>
            <div
              className="panel-soft"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 16px",
                borderRadius: "999px",
                marginBottom: "22px",
                color: "#f8fbff",
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.16)",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #3b82f6, #14b8a6)",
                }}
              />
              Book household and repair services with confidence
            </div>

            <h2
              style={{
                margin: 0,
                maxWidth: "760px",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 7vw, 5.6rem)",
                lineHeight: 0.96,
                letterSpacing: "-0.07em",
              }}
            >
              Professional local services without the guesswork.
            </h2>

            <p
              style={{
                margin: "22px 0 0",
                maxWidth: "620px",
                color: "rgba(255,255,255,0.76)",
                fontSize: "17px",
                lineHeight: 1.8,
              }}
            >
              Find trusted electricians, plumbers, cleaners, mechanics, and more.
              Compare options, make bookings, track progress, and manage reviews in one
              polished platform.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "30px" }}>
              <Link to="/register" className="btn-primary">
                Start Booking
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="btn-secondary"
                style={{ color: "#f8fbff", background: "rgba(255,255,255,0.08)" }}
              >
                Sign In
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "14px",
                marginTop: "36px",
                maxWidth: "620px",
              }}
            >
              {[
                { value: "4+", label: "Core service categories" },
                { value: "24/7", label: "Anytime booking access" },
                { value: "3 roles", label: "Users, providers, and admins in one platform" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="panel-soft"
                  style={{
                    padding: "18px",
                    borderRadius: "22px",
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.14)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "28px", fontWeight: 800 }}>{item.value}</p>
                  <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.72)", fontSize: "13px" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="panel"
            style={{
              padding: "24px",
              borderColor: "rgba(255,255,255,0.14)",
              background: "rgba(8, 14, 26, 0.64)",
            }}
          >
            <p className="page-kicker" style={{ color: "rgba(255,255,255,0.66)" }}>
              Featured Categories
            </p>
            <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
              {categories.map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "16px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "18px",
                      display: "grid",
                      placeItems: "center",
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(20,184,166,0.18))",
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{label}</p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "rgba(255,255,255,0.72)",
                        fontSize: "13px",
                        lineHeight: 1.6,
                      }}
                    >
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "80px clamp(20px, 5vw, 64px) 32px",
          color: "#f8fbff",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div style={{ color: "#f8fbff" }}>
            <p className="page-kicker" style={{ color: "rgba(255,255,255,0.54)" }}>
              Why teams choose us
            </p>
            <h2
              className="page-title"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#f8fbff" }}
            >
              A cleaner way to manage service bookings.
            </h2>
            <p className="page-subtitle" style={{ color: "rgba(255,255,255,0.68)" }}>
              The interface is designed to reduce friction for both customers and providers,
              with clearer status visibility, stronger visual hierarchy, and streamlined actions.
            </p>

            <div
              className="panel"
              style={{
                marginTop: "24px",
                padding: "22px",
                color: "#f8fbff",
                background: "rgba(8, 14, 26, 0.72)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "16px",
                    display: "grid",
                    placeItems: "center",
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(20,184,166,0.16))",
                  }}
                >
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="page-kicker" style={{ margin: 0, color: "rgba(255,255,255,0.54)" }}>
                    Payment Flow
                  </p>
                  <h3
                    style={{
                      margin: "6px 0 0",
                      fontSize: "20px",
                      fontFamily: "var(--font-display)",
                      color: "#f8fbff",
                    }}
                  >
                    How payments work
                  </h3>
                </div>
              </div>

              <div style={{ display: "grid", gap: "14px" }}>
                {paymentFlow.map((item, index) => (
                  <div
                    key={item.title}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "12px",
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "999px",
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(255,255,255,0.08)",
                        color: "#f8fbff",
                        fontSize: "12px",
                        fontWeight: 800,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>{item.title}</p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "rgba(255,255,255,0.68)",
                          lineHeight: 1.7,
                          fontSize: "14px",
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {highlights.map(({ title, text, icon: Icon }) => (
              <div
                key={title}
                className="panel"
                style={{
                  padding: "22px",
                  color: "#f8fbff",
                  background: "rgba(8, 14, 26, 0.72)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "18px",
                      display: "grid",
                      placeItems: "center",
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,0.16), rgba(20,184,166,0.16))",
                      color: "#f8fbff",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: "2px 0 8px",
                        fontSize: "20px",
                        fontFamily: "var(--font-display)",
                        color: "#f8fbff",
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.68)",
                        lineHeight: 1.75,
                        fontSize: "15px",
                      }}
                    >
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "18px clamp(20px, 5vw, 64px) 32px" }}>
        <div
          className="panel"
          style={{
            padding: "28px",
            color: "#f8fbff",
            background: "rgba(8, 14, 26, 0.76)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "18px",
              flexWrap: "wrap",
              alignItems: "flex-end",
              marginBottom: "22px",
            }}
          >
            <div>
              <p className="page-kicker" style={{ color: "rgba(255,255,255,0.54)" }}>
                Role Access
              </p>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  letterSpacing: "-0.05em",
                  color: "#f8fbff",
                }}
              >
                One landing page, clear paths for every role.
              </h2>
            </div>
            <p
              style={{
                margin: 0,
                maxWidth: "460px",
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.7,
                fontSize: "15px",
              }}
            >
              Visitors can instantly see how the product supports customers booking help,
              providers offering services, and admins managing the marketplace.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {roles.map(({ role, title, description, icon: Icon, accent, points }) => (
              <div
                key={role}
                className="panel-soft"
                style={{
                  padding: "22px",
                  color: "#f8fbff",
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "18px",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: "18px",
                    background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.04))`,
                  }}
                >
                  <Icon size={22} />
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "var(--brand-2)",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {role}
                </p>
                <h3
                  style={{
                    margin: "10px 0 10px",
                    fontFamily: "var(--font-display)",
                    fontSize: "21px",
                    color: "#f8fbff",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.68)",
                    lineHeight: 1.75,
                    fontSize: "15px",
                  }}
                >
                  {description}
                </p>

                <div style={{ display: "grid", gap: "10px", marginTop: "18px" }}>
                  {points.map((point) => (
                    <div
                      key={point}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "14px",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "999px",
                          background: "linear-gradient(135deg, #3b82f6, #14b8a6)",
                          flexShrink: 0,
                        }}
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "32px clamp(20px, 5vw, 64px) 88px" }}>
        <div
          className="panel"
          style={{
            padding: "28px",
            color: "#f8fbff",
            background: "rgba(8, 14, 26, 0.76)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <p className="page-kicker" style={{ color: "rgba(255,255,255,0.54)" }}>
              How it works
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.05em",
                color: "#f8fbff",
              }}
            >
              From search to service, the flow stays simple.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {steps.map((step) => (
              <div
                key={step.number}
                className="panel-soft"
                style={{
                  padding: "22px",
                  color: "#f8fbff",
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "var(--brand-2)",
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  Step {step.number}
                </p>
                <h3
                  style={{
                    margin: "12px 0 10px",
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    color: "#f8fbff",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.68)",
                    lineHeight: 1.75,
                    fontSize: "15px",
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
