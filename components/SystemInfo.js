export default function SystemInfo({ system }) {
    if (!system) return null
  
    return (
      <div className="absolute top-4 right-4 bg-gray-800 text-white p-4 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-2" style={{ color: system.color }}>
          {system.name}
        </h2>
        <p className="text-gray-300">{system.description}</p>
      </div>
    )
  }