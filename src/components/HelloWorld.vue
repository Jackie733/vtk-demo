<script setup lang="ts">
import { ref, unref, onMounted, onBeforeUnmount, watchEffect } from "vue";

import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkConeSource from "@kitware/vtk.js/Filters/Sources/ConeSource";

const vtkContainer = ref(null);
const context = ref<{
  fullScreenRenderer: unknown;
  renderWindow: unknown;
  renderer: unknown;
  actor: vtkActor;
  mapper: vtkMapper;
  coneSource: vtkConeSource;
} | null>(null);
const coneResolution = ref(6);
const representation = ref(2);

function setConeResolution(res: string) {
  coneResolution.value = Number(res);
}

function setRepresentation(rep: string) {
  representation.value = Number(rep);
}

watchEffect(() => {
  const res = unref(coneResolution);
  const rep = unref(representation);
  if (context.value) {
    const { actor, coneSource, renderWindow } = context.value;
    coneSource.setResolution(res);
    actor.getProperty().setRepresentation(rep);
    renderWindow.render();
  }
});

onMounted(() => {
  if (!context.value) {
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      rootContainer: vtkContainer.value
    });
    const coneSource = vtkConeSource.newInstance({ height: 1.0 });

    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(coneSource.getOutputPort());

    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);

    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();

    renderer.addActor(actor);
    renderer.resetCamera();
    renderWindow.render();

    context.value = {
      fullScreenRenderer,
      renderWindow,
      renderer,
      coneSource,
      actor,
      mapper
    };
  }
});

onBeforeUnmount(() => {
  if (context.value) {
    const { fullScreenRenderer, coneSource, actor, mapper } = context.value;
    actor.delete();
    mapper.delete();
    coneSource.delete();
    fullScreenRenderer.delete();
    context.value = null;
  }
});
</script>

<template>
  <div>
    <div ref="vtkContainer" />
    <table class="absolute top-6 left-6 bg-white p-3">
      <tbody>
        <tr>
          <td>
            <select
              style="width: 100%"
              :value="representation"
              @change="setRepresentation($event.target?.value)"
            >
              <option value="0">Points</option>
              <option value="1">Wireframe</option>
              <option value="2">Surface</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <input
              type="range"
              min="4"
              max="80"
              :value="coneResolution"
              @input="setConeResolution($event.target?.value)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.controls {
  position: absolute;
  top: 25px;
  left: 25px;
  background: white;
}
</style>
