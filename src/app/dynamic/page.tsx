import Footer from "@/app/components/footer";
import { getDynamicPage } from "../admin/dynamic/actions";

export const dynamic = "force-dynamic";

export default async function DynamicPage() {
  const data = await getDynamicPage();
  const showHeader = data.showHeader !== false;
  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header (optional) */}
      {showHeader && (
        <div className="bg-main-100 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2 text-right">{data.title}</h1>

            {data.subtitle && data.showSubtitle !== false && (
              <p className="text-lg text-gray-200 text-right mt-1">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-10 space-y-10">
        {data.blocks
          .filter((b) => b.visible !== false)
          .map((block) => {
            if (block.type === "hero") {
              return (
                <section
                  key={block.id}
                  className="bg-white  p-8 border-r-4 border-main-100"
                >
                  <h2 className="text-3xl font-bold text-main-100 mb-3 text-right">
                    {block.title}
                  </h2>
                  {block.subtitle && (
                    <p className="text-lg text-gray-700 text-right">
                      {block.subtitle}
                    </p>
                  )}
                </section>
              );
            }

            if (block.type === "section") {
              return (
                <section
                  key={block.id}
                  className="bg-white p-6 border-r-4 border-gray-300"
                >
                  <h2 className="text-2xl font-bold mb-4 text-main-100 text-right">
                    {block.title}
                  </h2>
                  <div className="space-y-4">
                    {block.paragraphs?.map((p, i) => (
                      <p
                        key={i}
                        className="text-lg leading-relaxed text-gray-700 text-right"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              );
            }

            if (block.type === "text") {
              return (
                <section key={block.id} className="bg-white p-6">
                  <p className="text-lg leading-relaxed text-gray-700 text-right">
                    {block.text}
                  </p>
                </section>
              );
            }

            if (block.type === "list") {
              return (
                <section key={block.id} className="bg-white p-6">
                  {block.title && (
                    <h2 className="text-xl font-bold mb-3 text-main-100 text-right">
                      {block.title}
                    </h2>
                  )}
                  <ul className="list-disc mr-6 space-y-2 text-right text-lg text-gray-700">
                    {block.items?.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                </section>
              );
            }

            if (block.type === "spacer") {
              return (
                <div
                  key={block.id}
                  style={{ height: `${block.height ?? 32}px` }}
                />
              );
            }

            if (block.type === "timeline") {
              return (
                <section key={block.id} className="bg-white border-t py-12">
                  <div className="container mx-auto px-4">
                    {block.title && (
                      <h2 className="text-3xl font-bold mb-8 text-center text-main-100">
                        {block.title}
                      </h2>
                    )}
                    <div className="max-w-3xl mx-auto">
                      <div className="space-y-6">
                        {block.items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 text-right"
                          >
                            <div className="flex-1">
                              <h3 className="font-bold text-main-100">
                                {item.label}
                              </h3>
                              <p className="text-gray-600">
                                {item.description}
                              </p>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full ${
                                item.color === "gray"
                                  ? "bg-gray-400"
                                  : item.color === "black"
                                    ? "bg-black"
                                    : "bg-main-100"
                              }`}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );
            }

            if (block.type === "keyFigures") {
              return (
                <section key={block.id} className="bg-white border-b">
                  <div className="container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-6 text-right text-main-100">
                      {block.title ?? "الشخصيات الرئيسية"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {block.figures?.map((f) => (
                        <div
                          key={f.id}
                          className="bg-gray-50 p-4 border-r-4 border-main-100"
                        >
                          <h3 className="font-bold text-right text-main-100 mb-2">
                            {f.name}
                          </h3>
                          <p className="text-sm text-gray-600 text-right">
                            {f.role}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            if (block.type === "cards") {
              const cols =
                block.layout === "2"
                  ? "md:grid-cols-2"
                  : block.layout === "4"
                    ? "md:grid-cols-4"
                    : "md:grid-cols-3";

              return (
                <section key={block.id} className="bg-white p-8">
                  {block.title && (
                    <h2 className="text-2xl font-bold mb-6 text-main-100 text-right">
                      {block.title}
                    </h2>
                  )}
                  <div className={`grid grid-cols-1 ${cols} gap-4`}>
                    {block.cards?.map((card) => (
                      <div
                        key={card.id}
                        className="border-r-4 border-main-100 bg-gray-50 p-4"
                      >
                        <h3 className="font-bold text-main-100 mb-2 text-right">
                          {card.title}
                        </h3>
                        <p className="text-gray-700 text-right text-sm">
                          {card.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (block.type === "image") {
              return (
                <section
                  key={block.id}
                  className={block.fullWidth ? "" : "bg-white p-6"}
                >
                  <div
                    className={
                      block.fullWidth
                        ? "w-full"
                        : "max-w-3xl mx-auto text-center"
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.src}
                      alt={block.alt ?? ""}
                      className={
                        block.fullWidth
                          ? "w-full h-auto"
                          : "inline-block max-w-full h-auto"
                      }
                    />
                    {block.caption && (
                      <p className="mt-2 text-sm text-gray-600 text-center">
                        {block.caption}
                      </p>
                    )}
                  </div>
                </section>
              );
            }

            if (block.type === "gallery") {
              const cols =
                block.columns === 2
                  ? "md:grid-cols-2"
                  : block.columns === 4
                    ? "md:grid-cols-4"
                    : "md:grid-cols-3";

              return (
                <section key={block.id} className="bg-white p-8">
                  {block.title && (
                    <h2 className="text-2xl font-bold mb-6 text-main-100 text-right">
                      {block.title}
                    </h2>
                  )}
                  <div className={`grid grid-cols-1 ${cols} gap-4`}>
                    {block.images?.map((img) => (
                      <figure key={img.id} className="text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.src}
                          alt={img.alt ?? ""}
                          className="w-full h-auto"
                        />
                        {img.caption && (
                          <figcaption className="mt-1 text-xs text-gray-600">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </section>
              );
            }

            return null;
          })}
      </div>

      <Footer />
    </div>
  );
}
