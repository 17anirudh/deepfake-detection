import Landing from "./components/landing-component";
import TabsComponent from "./components/tab-component";
import Tech from "./components/tech-component";

export default function Home() {
  return (
    <div 
      className="flex items-center justify-center bg-zinc-50 font-sans w-screen"
      style={{
            background: "linear-gradient(135deg, #0a0613 0%, #150d27 100%)"
            }}
    >
      <main>
        <div id="top" className="h-220">
        <Landing />
        </div>
        <div id="form" className="w-full flex justify-center h-screen min-h-261">
          <TabsComponent />
        </div>
        <div id="tech" className="mt-20 w-full flex justify-center h-screen">
          <Tech />
        </div>
      </main>
    </div>
  );
}
