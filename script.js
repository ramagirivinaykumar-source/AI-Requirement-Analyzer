// ==================================
// GLOBAL VARIABLE
// ==================================

let detectedConflict = "";

// ==================================
// ANALYZE DOCUMENT
// ==================================

function analyzeDoc() {

    detectedConflict = "";

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

            if (text.includes(word)) {

                ambiguities++;

                ambiguityList.push(
                    `"${word}" is ambiguous`
                );
            }
        });

        // =====================
        // CONTRADICTION RULES
        // =====================

        if (
            text.includes("must log in") &&
            text.includes("without logging in")
        ) {

            contradictions++;

            detectedConflict = "login";

            contradictionList.push(
                "Login required conflicts with access without login."
            );
        }

        if (
            text.includes("offline") &&
            text.includes("cloud")
        ) {

            contradictions++;

            detectedConflict = "offline";

            contradictionList.push(
                "Offline operation conflicts with cloud synchronization."
            );
        }

        if (
            text.includes("retained") &&
            text.includes("deleted")
        ) {

            contradictions++;

            detectedConflict = "retention";

            contradictionList.push(
                "Data retention conflicts with deletion policy."
            );
        }

        if (
            text.includes("online payment") &&
            (
                text.includes("shall not connect") ||
                text.includes("must not connect")
            )
        ) {

            contradictions++;

            detectedConflict = "payment";

            contradictionList.push(
                "Online payment conflicts with payment-service restriction."
            );
        }

        if (
            text.includes("99.99% uptime") &&
            text.includes("every sunday")
        ) {

            contradictions++;

            detectedConflict = "uptime";

            contradictionList.push(
                "High uptime conflicts with weekly downtime."
            );
        }

        if (
            text.includes("20 gb") &&
            text.includes("2 gb")
        ) {

            contradictions++;

            detectedConflict = "storage";

            contradictionList.push(
                "Upload size exceeds available storage."
            );
        }

        // =====================
        // DEPENDENCY CHECKS
        // =====================

        if (
            text.includes("invoice") &&
            !text.includes("payment")
        ) {
            missingDependencies++;
        }

        if (
            text.includes("authentication") &&
            !text.includes("login")
        ) {
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

        // =====================
        // SHOW RESOLVE BUTTON
        // =====================

        if (contradictions > 0) {

            document.getElementById("resolutionBox").style.display = "block";
            document.getElementById("resolutionResult").innerHTML = "";

        } else {

            document.getElementById("resolutionBox").style.display = "none";
        }
    };

    reader.readAsText(file);
}

// ==================================
// AI RESOLUTION ENGINE
// ==================================

function generateResolution() {

    let resolution = "";

    if (detectedConflict === "login") {

        resolution = `
        <div class="resolution-box">

            <h3>🤖 AI Resolution Generated</h3>

            <p><b>Conflict Type:</b> Login Policy Conflict</p>

            <p><b>Reason:</b>
            One requirement requires authentication while
            another allows access without authentication.
            </p>

            <p><b>Suggested Resolution:</b>
            Allow guest access only for public content and
            require authentication for protected resources.
            </p>

            <p><b>Improved Requirement:</b>
            Users must authenticate before accessing
            protected resources. Public content may be
            viewed without login.
            </p>

        </div>
        `;
    }

    else if (detectedConflict === "offline") {

        resolution = `
        <div class="resolution-box">

            <h3>🤖 AI Resolution Generated</h3>

            <p><b>Conflict Type:</b> Offline vs Cloud Conflict</p>

            <p><b>Reason:</b>
            The system is required to work offline while
            also depending on cloud services.
            </p>

            <p><b>Suggested Resolution:</b>
            Store data locally when offline and synchronize
            with the cloud when connectivity is restored.
            </p>

            <p><b>Improved Requirement:</b>
            The system shall support offline operation
            through local storage and synchronize data
            automatically when internet access becomes available.
            </p>

        </div>
        `;
    }

    else if (detectedConflict === "retention") {

        resolution = `
        <div class="resolution-box">

            <h3>🤖 AI Resolution Generated</h3>

            <p><b>Conflict Type:</b> Data Retention Conflict</p>

            <p><b>Suggested Resolution:</b>
            Define a retention period after which data
            is permanently deleted.
            </p>

        </div>
        `;
    }

    else if (detectedConflict === "payment") {

        resolution = `
        <div class="resolution-box">

            <h3>🤖 AI Resolution Generated</h3>

            <p><b>Conflict Type:</b> Payment Integration Conflict</p>

            <p><b>Suggested Resolution:</b>
            Allow secure connections only to approved
            payment gateway providers.
            </p>

        </div>
        `;
    }

    else if (detectedConflict === "uptime") {

        resolution = `
        <div class="resolution-box">

            <h3>🤖 AI Resolution Generated</h3>

            <p><b>Conflict Type:</b> Availability Conflict</p>

            <p><b>Suggested Resolution:</b>
            Schedule maintenance during low-traffic hours
            and exclude planned maintenance from uptime calculations.
            </p>

        </div>
        `;
    }

    else if (detectedConflict === "storage") {

        resolution = `
        <div class="resolution-box">

            <h3>🤖 AI Resolution Generated</h3>

            <p><b>Conflict Type:</b> Storage Capacity Conflict</p>

            <p><b>Suggested Resolution:</b>
            Increase storage limits or reduce maximum upload size.
            </p>

        </div>
        `;
    }

    else {

        resolution = `
        <div class="resolution-box">

            <h3>No AI Resolution Available</h3>

            <p>No contradiction was detected.</p>

        </div>
        `;
    }

    document.getElementById("resolutionResult").innerHTML = resolution;
}