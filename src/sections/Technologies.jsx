import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

const LOGOS = [
  "Helion", "Northwind", "Atlas Robotics", "Lattice", "Polaris", "Vector",
  "Kestrel", "Nimbus Labs", "Aperture", "Foundry", "Quanta", "Sable",
];

export default function Technologies() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="container-x">
        <SectionTitle
          eyebrow="Customers & partners"
          eyebrowTone="violet"
          title="Trusted where uptime is not optional."
        />
      </div>

      <Reveal className="marquee relative mt-14 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max items-center gap-12 pl-12">
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center gap-3 whitespace-nowrap text-2xl font-semibold tracking-tight text-fg-3 transition-colors duration-300 hover:text-fg sm:text-3xl"
            >
              <span
                className="inline-block size-2 rounded-sm"
                style={{
                  background:
                    i % 3 === 0
                      ? "hsl(178 92% 66%)"
                      : i % 3 === 1
                      ? "hsl(262 90% 72%)"
                      : "hsl(38 95% 64%)",
                  boxShadow: "0 0 12px currentColor",
                }}
              />
              {name}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
