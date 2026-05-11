import { useEffect, useMemo, useState } from "react";
import { Home } from "./screens/Home";
import { VibeQuiz } from "./screens/VibeQuiz";
import { Builder } from "./screens/Builder";
import { Result } from "./screens/Result";
import {
  recommendFromBuilder,
  recommendFromVibe,
  type BuilderAnswers,
  type DressResult,
  type VibeAnswers,
} from "./lib/dress";
import { logEvent } from "./lib/log";

type Route =
  | { name: "home" }
  | { name: "vibe" }
  | { name: "builder" }
  | { name: "result"; result: DressResult; via: "vibe" | "builder" };

export default function App() {
  const [route, setRoute] = useState<Route>({ name: "home" });

  useEffect(() => {
    logEvent("view", { screen: route.name });
  }, [route.name]);

  const view = useMemo(() => {
    switch (route.name) {
      case "home":
        return (
          <Home
            onPickVibe={() => {
              logEvent("path_chosen", { path: "vibe" });
              setRoute({ name: "vibe" });
            }}
            onPickBuilder={() => {
              logEvent("path_chosen", { path: "builder" });
              setRoute({ name: "builder" });
            }}
          />
        );
      case "vibe":
        return (
          <VibeQuiz
            onBack={() => setRoute({ name: "home" })}
            onComplete={(answers: VibeAnswers) => {
              const result = recommendFromVibe(answers);
              logEvent("recommendation", {
                via: "vibe",
                answers,
                result: { name: result.name, character: result.characterName },
              });
              setRoute({ name: "result", result, via: "vibe" });
            }}
          />
        );
      case "builder":
        return (
          <Builder
            onBack={() => setRoute({ name: "home" })}
            onComplete={(answers: BuilderAnswers) => {
              const result = recommendFromBuilder(answers);
              logEvent("recommendation", {
                via: "builder",
                answers,
                result: { name: result.name, character: result.characterName },
              });
              setRoute({ name: "result", result, via: "builder" });
            }}
          />
        );
      case "result":
        return (
          <Result
            result={route.result}
            via={route.via}
            onRestart={() => setRoute({ name: "home" })}
            onTryOther={() =>
              setRoute(
                route.via === "vibe" ? { name: "builder" } : { name: "vibe" }
              )
            }
          />
        );
    }
  }, [route]);

  return <div className="app-shell">{view}</div>;
}
