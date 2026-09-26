function analyzeDoc() {

    const fileInput = document.getElementById("fileInput");
    const output = document.getElementById("output");

    if (!fileInput.files.length) {
        output.innerHTML =
        "<p style='color:red'>Please upload a TXT file first.</p>";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {

        const text = event.target.result.toLowerCase();

        let contradictions = 0;
        let ambiguities = 0;
        let missingDependencies = 0;

        let contradictionList = [];
        let ambiguityList = [];

        // =====================
        // AMBIGUOUS REQUIREMENTS
        // =====================

        const ambiguousWords = [
            "quickly",
            "fast",
            "easy",
            "simple",
            "secure",
            "highly secure",
            "efficient",
            "instantly",
            "user-friendly",
            "robust",
            "scalable",
            "reliable",
            "strong"
        ];

        ambiguousWords.forEach(word => {

            if(text.includes(word)){
                ambiguities++;

                ambiguityList.push(
                    `"${word}" is ambiguous`
                );
            }

        });

        // =====================
        // CONTRADICTION RULES
        // =====================

        if(
            text.includes("must log in") &&
            text.includes("without logging in")
        ){
            contradictions++;

            contradictionList.push(
                "Login required conflicts with access without login."
            );
        }

        if(
            text.includes("offline") &&
            text.includes("cloud")
        ){
            contradictions++;

            contradictionList.push(
                "Offline operation conflicts with cloud synchronization."
            );
        }

        if(
            text.includes("retained") &&
            text.includes("deleted")
        ){
            contradictions++;

            contradictionList.push(
                "Data retention conflicts with deletion policy."
            );
        }

        if(
            text.includes("online payment") &&
            (
                text.includes("shall not connect") ||
                text.includes("must not connect")
            )
        ){
            contradictions++;

            contradictionList.push(
                "Online payment conflicts with payment-service restriction."
            );
        }

        if(
            text.includes("99.99% uptime") &&
            text.includes("every sunday")
        ){
            contradictions++;

            contradictionList.push(
                "High uptime conflicts with weekly downtime."
            );
        }

        if(
            text.includes("20 gb") &&
            text.includes("2 gb")
        ){
            contradictions++;

            contradictionList.push(
                "Upload size exceeds available storage."
            );
        }

        // =====================
        // DEPENDENCY CHECKS
        // =====================

        if(
            text.includes("invoice") &&
            !text.includes("payment")
        ){
            missingDependencies++;
        }

        if(
            text.includes("authentication") &&
            !text.includes("login")
        ){
            missingDependencies++;
        }

        // =====================
        // QUALITY SCORE
        // =====================

        const qualityScore = Math.max(
            100 -
            (contradictions * 15) -
            (ambiguities * 5) -
            (missingDependencies * 10),
            0
        );

        // =====================
        // UPDATE DASHBOARD
        // =====================

        document.getElementById("ambiguousCount").innerText =
        ambiguities;

        document.getElementById("conflictCount").innerText =
        contradictions;

        document.getElementById("dependencyCount").innerText =
        missingDependencies;

        document.getElementById("qualityScore").innerText =
        qualityScore + "%";

        // =====================
        // RESULTS PANEL
        // =====================

        output.innerHTML = `
        <h3>✅ Analysis Complete</h3>

        <br>

        <p>🔴 Contradictions Found:
        <b>${contradictions}</b></p>

        <ul>
        ${contradictionList.map(item =>
        `<li>${item}</li>`).join("")}
        </ul>

        <br>

        <p>⚠ Ambiguous Requirements:
        <b>${ambiguities}</b></p>

        <ul>
        ${ambiguityList.map(item =>
        `<li>${item}</li>`).join("")}
        </ul>

        <br>

        <p>🟡 Missing Dependencies:
        <b>${missingDependencies}</b></p>

        <br>

        <p>🟢 Quality Score:
        <b>${qualityScore}/100</b></p>
        `;
    };

    reader.readAsText(file);
}