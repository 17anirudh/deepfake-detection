import Landing from "./components/landing-component";
import TabsComponent from "./components/tab-component";
import Tech from "./components/tech-component";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black w-screen">
      <main style={{
        background: "linear-gradient(135deg, #0a0613 0%, #150d27 100%)",
      }}>
        <div id="top" className="w-screen">
        <Landing />
        </div>
        <div id="form" className="mt-20 w-full flex justify-center h-screen">
          <TabsComponent />
        </div>
        <div id="tech" className="mt-20 w-full flex justify-center h-screen">
          <Tech />
        </div>
      </main>
    </div>
  );
}
