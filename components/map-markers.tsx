export function PlaceMarker({ label }: { label: string }) {
  return (
    <div
      className="relative cursor-pointer select-none whitespace-nowrap rounded-lg bg-[#3C9BD5] px-3 py-1.5 font-semibold text-white shadow-md transition-all duration-300 ease-out hover:bg-[#2D509F] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
      style={{
        fontSize: "12px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {label}
    </div>
  );
}

export function LocationMarker() {
  return (
    <div className="relative h-6 w-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes location-pulse-marker {
            0% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            70% {
              box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
          }
        `,
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-blue-500 shadow-md"
        style={{
          animation:
            "location-pulse-marker 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />
    </div>
  );
}
