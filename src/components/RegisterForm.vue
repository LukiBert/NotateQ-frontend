<script setup lang="ts">
import {
  NCard,
  NFormItem,
  NButton,
  NDivider,
  NIcon,
  NTabs,
  NTabPane,
  NForm,
  NFormItemRow,
  NInput,
  NCheckbox,
  NSpace,
  NPopover
} from 'naive-ui'
import { ArrowForwardOutline } from '@vicons/ionicons5'

function handleClick() {}
</script>

<template>
  <div class="back">
    <n-card class="card">
      <n-form-item>
        <n-button @click="handleClick" style="width: 100%; margin: 0 auto;"> Wykorzystaj konto Google</n-button>
      </n-form-item>

      <n-form-item>
        <h3 style="width: 80%; margin: 0 auto;">
          Użyj nowych danych
        </h3>
      </n-form-item>

      <n-form-item>
        <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <n-tab-pane name="signin" tab="Logowanie">
            <n-form>
              <n-form-item-row label="e-mail" required>
                <n-input style="width: 80%; margin: 0 auto;"/>
              </n-form-item-row>
              <n-form-item-row label="hasło" required>
                <n-input style="width: 80%; margin: 0 auto;"/>
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong> Zaloguj</n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="Rejestracja">
            <n-form>
              <n-form-item-row label="e-mail" required>
                <n-input style="width: 80%; margin: 0 auto;"/>
              </n-form-item-row>
              <n-form-item-row label="hasło" required style="justify-content: center;">
                <n-popover trigger="hover">
                  <template #trigger>
                    <n-input style="width: 80%; margin: 0 auto;"/>
                  </template>
                  <div>
                    Hasło musi zawierać:
                    <ul style="text-align: left; padding-left: 16px;">
                      <li>minimum 8 znaków</li>
                      <li>jedną cyfrę</li>
                      <li>specjalny znak (!@#$%^&*)</li>
                    </ul>
                  </div>
                </n-popover>
              </n-form-item-row>
              <n-form-item-row label="powtórz hasło" required>
                <n-input style="width: 80%; margin: 0 auto;"/>
              </n-form-item-row>
            </n-form>
            <n-space>
              <n-checkbox style="margin-right: 12px" required>
                Akceptuj regulamin korzystania z Notateq
              </n-checkbox>
            </n-space>
            <n-button class="register-button" type="primary" block secondary strong>
              Utwórz nowe konto
            </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-form-item>
    </n-card>
  </div>
</template>

<style scoped>
.back {
  background: #14532d;
}

.card {
  display: flex;
  align-items: center;
  max-width: 450px;
  min-height: 650px;
  max-height: none;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  text-align: center;
}

.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}

.register-button {
  margin-top: 12px;
}
</style>