<template>
  <div>
    <div>
      <RangeSelect />
    </div>summary

    <SummaryTable />
  </div>
</template>

<script>
import SummaryTable from '@/components/SummaryTable';
import RangeSelect from '@/components/RangeSelect';
export default {
  name: 'week-summary',
  components: { RangeSelect },
  data() {
    return {};
  }
};
</script>

<style>
</style>