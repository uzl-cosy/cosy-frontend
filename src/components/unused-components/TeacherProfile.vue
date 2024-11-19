<template>
  <div class="flex flex-row h-fit space-x-5 pt-10">
    <!-- Content on the left -->
    <div
      class="flex flex-col items-center justify-center border-r-2 bg-slate-200 p-7 rounded-xl"
    >
      <!-- <img
        src="src\assets\User2.svg"
        alt="Profilbild"
        class="h-32 w-32 mb-4 rounded-full overflow-hidden bg-slate-300"
      /> -->
      <p class="mb-2 font-light text-xl">Leonie Tiedemann</p>
      <p class="mb-2 font-light text-sm">l.tiedemann@uni-luebeck.de</p>

      <hr class="h-px my-4 bg-primary border-0 dark:bg-primary" />

      <div class="flex flex-col justify-center">
        <div class="flex flex-row justify-center">
          <p class="mb-2">Institut für Sozialmedizin</p>
        </div>

        <div class="flex flex-row justify-center">
          <p class="mb-2">Professorin für Pflege</p>
        </div>
      </div>
    </div>

    <!-- Content on the right -->
    <div class="flex flex-col space-y-2 ml-12 mt-1 w-2/3">
      <div
        class="bg-primary text-white shadow shadow-primary p-4 rounded-lg text-lg content-center"
      >
        <p>Kontakt</p>
      </div>

      <div class="flex flex-col justify-start p-5">
        <div class="flex flex-row p-2">
          <strong class="mr-2">Telefon:</strong>
          <span class="ml-2 pl-11">0451 234567</span>
        </div>

        <div class="flex flex-row p-2">
          <strong class="mr-2">Webex:</strong>
          <span class="ml-2 pl-11">uni-luebeck.webex.com/meet/l.tiedemann</span>
        </div>

        <div class="flex flex-row p-2">
          <strong class="mr-2">Anschrift:</strong>
          <span class="ml-2 pl-7">Ratzeburger Allee 160, Raum 2.16</span>
        </div>

        <div class="flex flex-row p-2">
          <strong class="mr-2">Sprechzeiten:</strong>
          <span class="ml-2">MO und MI 10 - 13 Uhr</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "TeacherProfile",
};
</script>
