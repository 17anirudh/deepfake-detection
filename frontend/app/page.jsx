import Landing from "./components/landing-component";
import TabsComponent from "./components/tab-component";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black w-screen">
      <main>
        <div id="top">
        <Landing />
        </div>
        <div id="form" className="mt-20 w-full flex justify-center h-screen">
          <TabsComponent />
        </div>
        <div id="tech">
          
        </div>
      </main>
    </div>
  );
}
