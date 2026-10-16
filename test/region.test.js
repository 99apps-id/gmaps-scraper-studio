// Uji resolusi wilayah: parsing alamat + kecamatan -> kota/provinsi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  provinceFromAddress, cityFromAddress, districtFromAddress, regionFromAddress,
  buildRegionIndex, resolveRegion, regionCore
} from '../lib/region.js';

const IDX = buildRegionIndex([
  { name: 'Kabupaten Bogor', province: 'Jawa Barat', subDistricts: ['Bojonggede', 'Cibinong'] },
  { name: 'Bandung', province: 'Jawa Barat', subDistricts: ['Coblong'] }
]);

test('provinsi dari alamat (anti false-positive nama pendek)', () => {
  assert.equal(provinceFromAddress('Jl. X, Bojonggede, Kabupaten Bogor, Jawa Barat 16920'), 'Jawa Barat');
  assert.equal(provinceFromAddress('Jl. Y, Kel. Ciburial, Kec. Cimenyan, Kabupaten Bandung, Jawa Barat 40198'), 'Jawa Barat');
  assert.equal(provinceFromAddress('Jl. Z, Kuta, Badung, Bali 80361'), 'Bali');
  // "Bali" tidak boleh cocok dari kata "Balikpapan".
  assert.equal(provinceFromAddress('Jl. W, Balikpapan, Kalimantan Timur'), 'Kalimantan Timur');
});

test('kota & kecamatan dari alamat', () => {
  assert.equal(cityFromAddress('Jl. A, Kec. Coblong, Kota Bandung, Jawa Barat'), 'Kota Bandung');
  assert.equal(districtFromAddress('Jl. A, Kec. Coblong, Kota Bandung, Jawa Barat'), 'Coblong');
  assert.equal(cityFromAddress('Jl. Raya Bogor, Kec. Cimanggis, Kota Depok'), 'Kota Depok');
  assert.equal(districtFromAddress('Jl. B, Kecamatan Bojonggede, Kabupaten Bogor'), 'Bojonggede');
  assert.deepEqual(regionFromAddress('Jl. A, Kec. Coblong, Kota Bandung, Jawa Barat'), { province: 'Jawa Barat', city: 'Kota Bandung', district: 'Coblong' });
});

test('resolve wilayah: kecamatan -> kota + provinsi induk', () => {
  const r = resolveRegion('Bojonggede', IDX);
  assert.equal(r.city, 'Kabupaten Bogor');
  assert.equal(r.province, 'Jawa Barat');
  assert.equal(r.district, 'Bojonggede');
  assert.equal(r.known, true);
});

test('resolve wilayah: kota & provinsi', () => {
  assert.equal(resolveRegion('Bandung', IDX).city, 'Bandung');
  assert.equal(resolveRegion('Bandung', IDX).province, 'Jawa Barat');
  const p = resolveRegion('Jawa Barat', IDX);
  assert.equal(p.province, 'Jawa Barat');
  assert.equal(p.city, '');
  assert.equal(p.provinceOnly, true);
});

test('input tak dikenal tidak dipaksa jadi provinsi', () => {
  const r = resolveRegion('tempat ngopi enak', IDX);
  assert.equal(r.province, '');
  assert.equal(r.known, false);
});

test('regionCore menyamakan Kota/Kabupaten', () => {
  assert.equal(regionCore('Kota Bogor'), regionCore('Kabupaten Bogor'));
  assert.equal(regionCore('Kota Bandung'), 'bandung');
});
