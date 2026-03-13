export default function Home() {
  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>CoreBoost</h1>
      <p>AI SEO Audit Platform</p>

      <form>
        <input
          type="text"
          placeholder="Enter a website URL"
          style={{ padding: "10px", width: "300px" }}
        />
        <button
          type="submit"
          style={{ marginLeft: "10px", padding: "10px" }}
        >
          Run Audit
        </button>
      </form>
    </main>
  );
}