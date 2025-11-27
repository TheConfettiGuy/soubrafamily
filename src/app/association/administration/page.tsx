import Footer from "@/app/components/footer";
import administrationData from "@/data/administration.json";

// ---- Explicit types so TS knows about `visible` ----
type Member = {
  name: string;
  position: string;
  visible?: boolean; // optional, defaults to shown
};

type Board = {
  year: string;
  title: string;
  description: string;
  note?: string;
  members: Member[];
  visible?: boolean; // optional, defaults to shown
};

type AdministrationData = {
  title: string;
  subtitle: string;
  boards: Board[];
};

// Cast imported JSON to our explicit type
const data = administrationData as AdministrationData;

const Page = () => {
  // Only show boards that are not explicitly hidden
  const boards: Board[] = (data.boards || []).filter(
    (board) => board.visible !== false
  );

  return (
    <div className="min-h-screen">
      <div className="bg-main-100 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-right">{data.title}</h1>
          <p className="text-lg text-white text-right mb-1">{data.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Boards */}
        <div className="space-y-8">
          {boards.map((board, index) => {
            // Only show members that are not explicitly hidden
            const visibleMembers =
              (board.members || []).filter(
                (member) => member.visible !== false
              ) ?? [];

            return (
              <div
                key={index}
                className="bg-white overflow-hidden transition-colors"
              >
                {/* Board header */}
                <div className="bg-main-100 text-white p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
                    <span className="text-3xl font-bold">{board.year}</span>
                    <span className="bg-white text-main-100 px-4 py-2 text-sm font-semibold">
                      {visibleMembers.length} عضو
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{board.title}</h2>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {board.description}
                  </p>
                  {board.note && (
                    <div className="mt-4 p-3 bg-white">
                      <p className="text-sm text-main-100">{board.note}</p>
                    </div>
                  )}
                </div>

                {/* Members grid */}
                <div style={{ paddingTop: "15px" }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleMembers.map((member, memberIndex) => (
                      <div
                        key={memberIndex}
                        className="flex items-start gap-3 p-4 transition-colors border-r-4 border-main-100 bg-gray-100"
                      >
                        <div className="shrink-0 w-8 h-8 bg-main-100 text-white flex items-center justify-center text-sm font-bold">
                          {memberIndex + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-main-100 text-lg mb-1">
                            {member.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {member.position}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
