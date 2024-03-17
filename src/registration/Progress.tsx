export const Progress = (props: { title: string }) => (
  <div class="progress-with-text mb-3">
    <p>
      <em>{props.title}...</em>
    </p>
    <div
      class="progress"
      role="progressbar"
      aria-label="Animated striped example"
      aria-valuenow="50"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="progress-bar progress-bar-striped progress-bar-animated"
        style="width: 50%"
      ></div>
    </div>
  </div>
);
