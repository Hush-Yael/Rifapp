import { Link } from "@tanstack/solid-router";
import { ArrowLeft } from "lucide-solid";

export default function NotFound() {
  return (
    <main class="fc flex-1 tac ">
      <div class="col gap-y-6 ma p-4" role="alert">
        <hgroup class="col gap-y-2">
          <h1 class="text-5xl font-bold tracking-wide">404</h1>
          <p class="text-2xl font-medium">Página no encontrada</p>
          <p class="text-muted-text text-balance">
            parece que intentaste acceder a una ruta que no existe
          </p>
        </hgroup>

        <Link to="/" href="" class="ui-btn ui-btn/primary p-2">
          <ArrowLeft class="size-5" />
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
