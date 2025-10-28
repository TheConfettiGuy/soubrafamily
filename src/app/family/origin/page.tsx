import Footer from "@/app/components/footer/page";
import originData from "@/data/origin.json";
const Origin = () => {
  return (
    <div className="min-h-screen bg-gray-white">
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">
            {originData.title}
          </h1>
          {/* <p className="text-xl text-gray-200 text-right">
            {originData.subtitle}
          </p> */}
          <p className="text-xl text-gray-300 mt-4 text-right italic">
            {originData.author}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

        <div className="space-y-12 ">
          {originData.sections.map((section) => {
            if (section.type === "text") {
              return (
                <section key={section.id}>
                  <div className="grid grid-cols-1 gap-4">
                    <p className="text-lg leading-relaxed text-gray-800">
                      {section.content}
                    </p>
                  </div>
                </section>
              );
            }

            if (section.type === "section" && "paragraphs" in section) {
              return (
                <section key={section.id}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-right text-main-100 border-r-4 border-main-100 pr-4">
                    {section.title}
                  </h2>
                  {section.paragraphs?.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-lg leading-relaxed text-gray-800 mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              );
            }

            if (section.type === "highlight" && "paragraphs" in section) {
              return (
                <section key={section.id} className="bg-gray-100 p-6">
                  {section.paragraphs?.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-lg leading-relaxed text-gray-800 mb-4 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              );
            }

            if (section.type === "section" && "list" in section) {
              return (
                <section key={section.id}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-right text-main-100 border-r-4 border-main-100 pr-4">
                    {section.title}
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-800 mb-4">
                    {section.intro}
                  </p>
                  <ul className="space-y-3 mr-6">
                    {section.list?.map((item, idx) => (
                      <li key={idx} className="text-lg text-gray-800">
                        <span className="font-semibold">{item.name}</span>
                        {item.description && `, ${item.description}`}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }

            if (section.type === "section" && "profiles" in section) {
              return (
                <section key={section.id}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-right text-main-100 border-r-4 border-main-100 pr-4">
                    {section.title}
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-800 mb-6">
                    {section.intro}
                  </p>

                  <div className="grid gap-4">
                    {section.profiles?.map((profile, idx) => (
                      <div
                        key={idx}
                        className="border-r-4 border-gray-300 pr-4"
                      >
                        <h3 className="font-bold text-lg text-gray-900">
                          {profile.name}
                        </h3>
                        <p className="text-gray-700 text-lg">
                          {profile.description}
                        </p>
                      </div>
                    ))}

                    {section.additionalMembers && (
                      <div className="bg-gray-100 p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-3">
                          {section.additionalMembers.title}
                        </h3>
                        <ul className="grid sm:grid-cols-2 gap-2 text-gray-700 text-lg">
                          {section.additionalMembers.members.map(
                            (member, idx) => (
                              <li key={idx}>• {member}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              );
            }

            return null;
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Origin;
