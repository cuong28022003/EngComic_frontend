import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles.scss';
import { createDeck } from "../../api/deckApi";
import { loginSuccess } from "../../redux/slice/auth";
import { useDispatch, useSelector } from "react-redux";

const CreateDeckPage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = useSelector((state) => state.auth.login?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);

        try {
            const res = await createDeck({
                name,
                description,
            }, user, dispatch, loginSuccess);
            console.log("Deck created successfully", res.data);

            // const createdDeck = res.data;
            // navigate(`/decks/${createdDeck.id}`);
        } catch (err) {
            console.error("Create deck failed", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={"create-deck-container"}>
            <h2>Create New Deck</h2>

            <form onSubmit={handleSubmit} className={"create-deck-form"}>
                <label>
                    Deck Name <span>*</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. Basic English"
                    />
                </label>

                <label>
                    Description
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional"
                    />
                </label>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Deck"}
                </button>
            </form>
        </div>
    );
};

export default CreateDeckPage;
