self.addEventListener("message", async (event) => {
	if (event.data.type === "start") {
		self.postMessage({ type: "started" });
		for (let i = 0; i < 10; i++) {
			await new Promise((resolve) => {
				setTimeout(resolve, Math.random() * 1000);
			});
			const progress = (i + 1) / 10;
			self.postMessage({ type: "progress", progress });
			console.log("Progress:", progress);
		}
		self.postMessage({ type: "complete" });
	}
});
