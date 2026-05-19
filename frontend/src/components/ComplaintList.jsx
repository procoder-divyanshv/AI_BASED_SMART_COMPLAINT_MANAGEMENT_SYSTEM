function ComplaintList({ complaints }) {

    return (

        <div>

            <h2>
                Complaints
            </h2>

            {
                complaints.map((c) => (

                    <div
                        key={c._id}
                        className="card"
                    >

                        <h3>
                            {c.title}
                        </h3>

                        <p>
                            {c.description}
                        </p>

                        <p>
                            <b>Status:</b>
                            {" "}
                            {c.status}
                        </p>

                        <p>
                            <b>Location:</b>
                            {" "}
                            {c.location}
                        </p>

                        <p>
                            <b>AI Response:</b>
                        </p>

                        <pre>
                            {c.aiResponse}
                        </pre>

                    </div>
                ))
            }

        </div>
    );
}

export default ComplaintList;