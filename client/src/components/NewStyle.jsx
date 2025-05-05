import css from './NewStyle.module.css';

function NewStyle() {
    return (
        <>
            <body>
                <div className={css["main-container"]}>
                    <div className={css["video-column"]}>
                        <div className={css["video-box"]}>
                            <img src="https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg?auto=compress&w=400&h=300" alt="User 1" />
                        </div>
                        <div className={css["video-box"]}>
                            <img src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&w=400&h=300" alt="User 2" />
                        </div>
                    </div>
                    <div className={css["chat-column"]}>
                        <div className={css["chat-header"]}>Chats</div>
                        <div className={css["chat-messages"]}>
                            <div className={css["chat-message"] + ' ' + css["left"]}>
                                <img className={css["avatar"]} src="https://randomuser.me/api/portraits/women/1.jpg" alt="Riya" />
                                <div>
                                    <div className={css["name-time"]}>
                                        <span className={css["name"]}>Riya Thakur</span>
                                        <span className={css["time"]}>11:01 AM</span>
                                    </div>
                                    <div className={css["bubble"]}>Good afternoon, everyone.</div>
                                    <div className={css["bubble"]}>We will start this meeting</div>
                                </div>
                            </div>
                            <div className={css["chat-message"] + ' ' + css["right"]}>
                                <img className={css["avatar"]} src="https://randomuser.me/api/portraits/men/2.jpg" alt="Janish" />
                                <div>
                                    <div className={css["name-time"]}>
                                        <span className={css["name"]}>Janish Goswami</span>
                                        <span className={css["time"]}>11:02 AM</span>
                                    </div>
                                    <div className={css["bubble"]}>Yes, Let's start this meeting</div>
                                </div>
                            </div>
                            <div className={css["chat-message"] + ' ' + css["left"]}>
                                <img className={css["avatar"]} src="https://randomuser.me/api/portraits/women/1.jpg" alt="Riya" />
                                <div>
                                    <div className={css["name-time"]}>
                                        <span className={css["name"]}>Riya Thakur</span>
                                        <span className={css["time"]}>12:04 AM</span>
                                    </div>
                                    <div className={css["bubble"]}>Today, we are here to discuss last week's sales.</div>
                                </div>
                            </div>
                        </div>
                        <div className={css["chat-input-row"]}>
                            <input type="text" placeholder="Type Something..." />
                            <button className={css["send-btn"]}>&#9658;</button>
                        </div>
                        <div className={css["chat-actions"]}>
                            <button className={css["action-btn"]}>Next Sever</button>
                            <button className={css["action-btn"]}>Next</button>
                        </div>
                    </div>
                </div>
            </body>
        </>
    )
}

export default NewStyle;
