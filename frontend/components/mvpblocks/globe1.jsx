import Earth from "@/components/ui/globe";
export default function Globe1() {
  return (
    <>
      <div className="flex flex-col items-center justify-center overflow-hidden">
        <Earth
              baseColor={[1, 0, 0.3]}
              markerColor={[1, 0, 0.33]}
              glowColor={[1, 0, 0.3]}
            />
      </div>
    </>
  );
}