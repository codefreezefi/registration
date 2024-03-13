import { Row } from "./Row";

export const AfterRegistration = () => (
  <Row>
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">After the registration</h2>
      </div>
      <div class="card-body">
        <ul>
          <li>
            Book your stay by email (remember to mention <code>Codefreeze</code>
            ; see{" "}
            <a href="https://codefreeze.fi/#accommodation" target="_blank">
              Accommodation
            </a>
            ), or ask for a roommate in the{" "}
            <a href="https://codefreeze.fi/chat" target="_blank">
              Matrix channel
            </a>{" "}
            for the event.
          </li>
          <li>
            Make travel arrangements to Kiilopää (see{" "}
            <a href="https://codefreeze.fi/#directions" target="_blank">
              Directions
            </a>
            ).
          </li>
          <li>
            Join our Matrix{" "}
            <a href="https://codefreeze.fi/chat" target="_blank">
              Matrix channel
            </a>{" "}
            to stay up to date.
          </li>
        </ul>
      </div>
    </div>
  </Row>
);
