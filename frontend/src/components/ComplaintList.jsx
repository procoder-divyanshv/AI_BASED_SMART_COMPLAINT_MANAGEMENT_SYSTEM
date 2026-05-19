function ComplaintList({ complaints }) {

    return (
        <div>

            <h2>Complaints</h2>

            {
                complaints.map((c) => {

                    const ai = c.aiResponse;

                    return (
                        <div
                            key={c._id}
                            className="card"
                        >

                            <h3>{c.title}</h3>

                            <p>{c.description}</p>

                            <p>
                                <b>Status:</b> {c.status}
                            </p>

                            <p>
                                <b>Location:</b> {c.location}
                            </p>

                            {/* AI SECTION */}
                            <div style={{ marginTop: "10px" }}>
                                <p><b>AI Priority:</b> {ai?.priority}</p>

                                <p><b>Department:</b> {ai?.department}</p>

                                <p><b>Summary:</b> {ai?.summary}</p>

                                <p><b>AI Response:</b></p>
                                <p>{ai?.professionalResponse}</p>
                            </div>

                        </div>
                    );
                })
            }

        </div>
    );
}

export default ComplaintList;