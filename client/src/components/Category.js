export default function Category({ values }) {
  return (
    <>
      {values.map((category, idx) => {
        return (
          <span key={idx} className="badge">
            {category}
          </span>
        );
      })}
    </>
  );
}
