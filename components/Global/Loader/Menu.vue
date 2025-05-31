<script setup>

</script>
<template>
  <UCard class="m-2 shadow shadow-gray-700 direction-set-rtl relative" >
    <USkeleton class="h-4 w-full h-[129px] "/>
    <template #footer>

      <USkeleton class="h-4 m-1"/>
      <USkeleton class="h-4 m-1"/>


      <div class="flex justify-between w-full items-center mt-2">
        <USkeleton class="h-4 w-1/3"/>
        <USkeleton class="h-5  w-5  rounded-full "/>
      </div>

    </template>

  </UCard>
</template>