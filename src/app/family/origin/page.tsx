import Footer from "@/app/components/footer";
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
        <div className="space-y-12">
          {originData.sections.map((section: any) => {
            // Simple text block
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

            // Highlight block with paragraphs
            if (section.type === "highlight") {
              return (
                <section key={section.id} className="bg-gray-100 p-6">
                  {section.paragraphs?.map((paragraph: string, idx: number) => (
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

            // Generic section that may include: intro, paragraphs, list, profiles, additionalMembers
            if (section.type === "section") {
              const hasParagraphs =
                Array.isArray(section.paragraphs) &&
                section.paragraphs.length > 0;
              const hasList =
                Array.isArray(section.list) && section.list.length > 0;
              const hasProfiles =
                Array.isArray(section.profiles) && section.profiles.length > 0;
              const hasAdditional =
                section.additionalMembers &&
                Array.isArray(section.additionalMembers.members) &&
                section.additionalMembers.members.length > 0;

              return (
                <section key={section.id}>
                  {/* Title */}
                  {section.title && (
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-right text-main-100 border-r-4 border-main-100 pr-4">
                      {section.title}
                    </h2>
                  )}

                  {/* Intro (optional) */}
                  {section.intro && (
                    <p className="text-lg leading-relaxed text-gray-800 mb-6">
                      {section.intro}
                    </p>
                  )}

                  {/* Paragraphs */}
                  {hasParagraphs &&
                    section.paragraphs.map((paragraph: string, idx: number) => (
                      <p
                        key={idx}
                        className="text-lg leading-relaxed text-gray-800 mb-4"
                      >
                        {paragraph}
                      </p>
                    ))}

                  {/* List (name + description) */}
                  {hasList && (
                    <ul className="space-y-3 mr-6">
                      {section.list.map(
                        (
                          item: { name: string; description?: string },
                          idx: number
                        ) => (
                          <li key={idx} className="text-lg text-gray-800">
                            <span className="font-semibold">{item.name}</span>
                            {item.description ? `، ${item.description}` : null}
                          </li>
                        )
                      )}
                    </ul>
                  )}

                  {/* Profiles (name + description) */}
                  {hasProfiles && (
                    <div className="grid gap-4 mt-6">
                      {section.profiles.map(
                        (
                          profile: { name: string; description?: string },
                          idx: number
                        ) => (
                          <div
                            key={idx}
                            className="border-r-4 border-gray-300 pr-4"
                          >
                            <h3 className="font-bold text-lg text-gray-900">
                              {profile.name}
                            </h3>
                            {profile.description && (
                              <p className="text-gray-700 text-lg">
                                {profile.description}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Additional members list */}
                  {hasAdditional && (
                    <div className="bg-gray-100 p-4 mt-6">
                      {section.additionalMembers.title && (
                        <h3 className="font-bold text-lg text-gray-900 mb-3">
                          {section.additionalMembers.title}
                        </h3>
                      )}
                      <ul className="grid sm:grid-cols-2 gap-2 text-gray-700 text-lg">
                        {section.additionalMembers.members.map(
                          (member: string, idx: number) => (
                            <li key={idx}>• {member}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
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
