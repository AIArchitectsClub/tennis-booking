import { useState, useEffect } from "react";

export function useCourts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courts")
      .then((r) => r.json())
      .then((data) => {
        // normalise snake_case from DB → camelCase for components
        setCourts(
          data.map((c) => ({
            id: c.id,
            name: c.name,
            surface: c.surface,
            indoor: c.indoor,
            pricePerHour: c.price_per_hour,
            image: c.image,
            description: c.description,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return { courts, loading };
}
