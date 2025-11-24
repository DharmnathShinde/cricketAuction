import News from "../components/News";
import Title from "../components/Title";

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-secondary via-slate-900 to-background-secondary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        {/* Animated gradient orbs for depth */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Modern title section with gradient text */}
          <div className="text-center mb-16 md:mb-20 space-y-6">
            <Title
              title="P99SOFT FUN COMMITTEE WELCOMES CAPTAINS FOR BID"
              fadeAnimation="left"
            />

            {/* Enhanced Description Section */}
            <div className="max-w-4xl mx-auto mt-10 space-y-6 animate-fade-in">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Your Ultimate Player Auction Experience
                </span>
              </h2>

              <div className="glassmorphism p-8 md:p-10 rounded-2xl backdrop-blur-xl">
                <p className="text-text-secondary text-lg md:text-xl lg:text-2xl leading-relaxed mb-6">
                  Step into the electrifying world of cricket player auctions!
                  Build your dream team by strategically bidding on your
                  favorite players in real-time. Experience the adrenaline rush
                  as you compete with other managers to secure the best talent
                  for your squad.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="flex flex-col items-center p-6 rounded-xl bg-background-tertiary/50 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                    <div className="text-4xl mb-3">⚡</div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      Real-Time Bidding
                    </h3>
                    <p className="text-sm text-text-muted text-center">
                      Participate in live auctions with instant updates and
                      competitive bidding
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-6 rounded-xl bg-background-tertiary/50 border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      Strategic Planning
                    </h3>
                    <p className="text-sm text-text-muted text-center">
                      Plan your budget wisely and build a balanced team with top
                      performers
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-6 rounded-xl bg-background-tertiary/50 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105">
                    <div className="text-4xl mb-3">🏆</div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      Track History
                    </h3>
                    <p className="text-sm text-text-muted text-center">
                      Review past auctions and analyze your bidding strategies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News section with modern card design */}
          <div className="mt-16 md:mt-20">
            <News />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
